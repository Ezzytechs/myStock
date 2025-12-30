const { gql } = require("apollo-server-express");

module.exports = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    role: String
  }

  type PaginatedMetaData {
    totalItems: Int
    totalPages: Int
    currentPage: Int
    perPage: Int
  }

  type PaginatedUsers {
    data: [User]
    meta: PaginatedMetaData
  }

  type Token {
    accessToken: String!
  }

  type UserStatistics {
    all: Int
    users: Int
    admins: Int
  }
  input RegisterInput {
    username: String!
    email: String!
    password: String!
  }

  input UpdateInput {
    username: String
    email: String
  }

  type Query {
    me: User
    users(page: Int = 1, limit: Int = 10): PaginatedUsers
    getUser(id: ID!): User
    userStats: UserStatistics
  }

  type Mutation {
    register(input: RegisterInput!): Token
    login(email: String!, password: String!): Token
    updateUser(input: UpdateInput!): User
    deleteUser(id: ID!): String
    logout: String
    refreshToken: String
  }
`;
