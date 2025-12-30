const { gql } = require("apollo-server-express");

module.exports = gql`
  type Category {
    id: ID!
    name: String!
    description: String
  }
  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
  }
  type Unit {
    id: ID!
    name: String!
    description: String
    category: Category
    owner: User
  }

  type PaginatedMetaData {
    totalItems: Int
    totalPages: Int
    currentPage: Int
    perPage: Int
  }

  type PaginatedUnits {
    data: [Unit]
    meta: PaginatedMetaData
  }

  type UnitStatistics {
    total: Int
  }

  input UnitInput {
    name: String!
    description: String
  }

  input UpdateUnitInput {
    name: String
    description: String
  }

  type Query {
    allUnits(page: Int = 1, limit: Int = 10): PaginatedUnits
    unitDetails(id: ID!): Unit
    unitStats: UnitStatistics
  }

  type Mutation {
    addUnit(input: UnitInput!): Unit
    updateUnit(id: ID!, input: UpdateUnitInput!): Unit
    deleteUnit(id: ID!): String
  }
`;
