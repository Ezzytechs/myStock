const { gql } = require("apollo-server-express");

module.exports = gql`
  type Token {
    accessToken: String!
  }

  type Mutation {
    register(input: RegisterInput!): Token
    login(email: String!, password: String!): Token
    logout: String
    refreshToken: String
  }
`;
