/**
 * Base Schema. ( Necessary because the types Query and Mutation will be extended in other files )
 */

const { gql }       = require( 'apollo-server' );

const typeDefs = gql`

    type Query {
        base: String
    }

    type Mutation {
        base: String
    }
`

module.exports = {
    typeDefs
}