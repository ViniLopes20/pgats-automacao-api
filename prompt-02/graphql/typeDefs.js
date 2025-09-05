const { gql } = require('apollo-server-express');

module.exports = gql`
  type User {
    username: String!
    password: String!
    favorecido: Boolean!
    saldo: Float!
  }

  type Transfer {
    from: String!
    to: String!
    amount: Float!
    date: String!
  }

  type AuthPayload {
    user: User!
    token: String!
  }

  type Query {
    users: [User!]!
    transfers: [Transfer!]!
  }

  type Mutation {
    register(username: String!, password: String!, favorecido: Boolean!, saldo: Float): User!
    login(username: String!, password: String!): AuthPayload!
    transfer(from: String!, to: String!, amount: Float!): Transfer!
  }
`;
