/**
 * Response Schema
 */

const { gql }  = require( 'apollo-server' );

const typeDefs = gql`

    directive @createToken on FIELD_DEFINITION

    type AuthResponse {
        msg: String!
        token: String! @createToken
        user: User!
    }

    type UserResponse {
        msg: String!
        user: User!
    }
`

module.exports = {
    typeDefs
}