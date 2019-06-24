const { SchemaDirectiveVisitor } = require( 'apollo-server' );
const { defaultFieldResolver }   = require( 'graphql' );

const { 
  AuthenticationError,
  AuthorizationError,
} = require( '../Errors' );

class AuthDirective extends SchemaDirectiveVisitor {

    visitObject( type ) {
      
      this.ensureFieldsWrapped( type );
      type._requiredAuthRole = this.args.requires;

    }
  
    visitFieldDefinition( field, details ) {
      
      this.ensureFieldsWrapped( details.objectType );
      field._requiredAuthRole = this.args.requires;

    }
  
    ensureFieldsWrapped( objectType ) {
      
      // Mark the GraphQLObjectType object to avoid re-wrapping:
      if ( objectType._authFieldsWrapped ) {
        return;
      }

      objectType._authFieldsWrapped = true;
  
      const fields      = objectType.getFields();
  
      Object.keys( fields ).forEach( fieldName => {

        const field     = fields[ fieldName ];
        const { resolve = defaultFieldResolver } = field;
  
        field.resolve   = async function( ...args ) {
  
          const context = args[2];
          const user    = context.loggedUser;

          if( !user ) {
            throw AuthenticationError();
          }

          const requiredRole = field._requiredAuthRole || objectType._requiredAuthRole;
          
          if ( !requiredRole ) {
            return resolve.apply( this, args );
          }
          
          if( !requiredRole.includes( user.role ) ) {
            throw AuthorizationError();
          }
  
          return resolve.apply( this, args );
        };

      });
    }
}

module.exports = {
    AuthDirective,
}