/**
 * User schema
 */

const { gql } = require('apollo-server');

const typeDefs = gql`
  directive @auth(requires: [Role]) on OBJECT | FIELD_DEFINITION

  enum Role {
    ADMIN
    USER
  }

  type User {
    id: ID!
    email: String!
    name: String!
    role: String!
    createAt: String!
  }

  extend type Query {
    getCurrentUser: User @auth
    getUser(id: ID!): User
    getUserByEmail(email: String!): User
    getUsersByName(name: String!): [User]
    getUsers: [User]
  }

  extend type Mutation {
    register(name: String!, email: String!, password: String!): AuthResponse!
    login(email: String!, password: String!): AuthResponse!
    forgotMyPassword(email: String!): UserResponse!
    resetPassword(
      email: String!
      token: String!
      password: String!
    ): UserResponse!
  }
`;

module.exports = {
  typeDefs
};
