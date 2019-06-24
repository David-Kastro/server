const { SchemaDirectiveVisitor } = require( 'apollo-server' );
const { defaultFieldResolver }   = require( 'graphql' );

const jwt                        = require( 'jsonwebtoken' );
const tokenConfig                = require( '../../Config/token' );

class TokenDirective extends SchemaDirectiveVisitor {

    visitFieldDefinition( field ) {

        const { resolve = defaultFieldResolver } = field;

        field.resolve   = async function(...args) {

          const result       = await resolve.apply( this, args );
          const { id, role } = result;

          return jwt.sign( {id, role}, tokenConfig.secret, {
              expiresIn: 86400, // 1 day
          })

        };
      }
  
}

module.exports = {
    TokenDirective
}