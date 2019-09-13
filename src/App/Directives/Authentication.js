const { SchemaDirectiveVisitor } = require( 'apollo-server' );
const { defaultFieldResolver }   = require( 'graphql' );

const { 
  AuthenticationError,
  AuthorizationError,
} = require( '../Errors' );

class AuthDirective extends SchemaDirectiveVisitor {

    visitObject( type ) {

      type._requiredAuthRole = this.args.requires;
      this.ensureFieldsWrapped( type, 'object' );

    }
  
    visitFieldDefinition( field, details ) {
    
      field._requiredAuthRole = this.args.requires;
      this.ensureFieldsWrapped( details.objectType, 'field' );

    }
  
    ensureFieldsWrapped( objectType, schemaType ) {
      
      // Mark the GraphQLObjectType object to avoid re-wrapping:
      if ( objectType._authFieldsWrapped ) {
        return;
      }

      objectType._authFieldsWrapped = true;
  
      const fields      = objectType.getFields();
      
      Object.keys( fields ).forEach( fieldName => {

        const field     = fields[ fieldName ];
        const { resolve = defaultFieldResolver, astNode } = field;

        const fildHasAuthDirective = astNode
          .directives
          .filter( directive => directive.kind === "Directive" && directive.name.value === 'auth' )
          .length > 0 || schemaType === 'object';
        
        field.resolve   = async function( ...args ) {
  
          const context = args[2];
          const user    = context.loggedUser;

          if( !fildHasAuthDirective ) {
            return resolve.apply( this, args );
          }

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