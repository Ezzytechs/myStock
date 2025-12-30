const { gql } = require("apollo-server-express");

module.exports = gql`
  type Category {
    id: ID!
    name: String!
    description: String
  }

  type PaginatedMetaData {
    totalItems: Int
    totalPages: Int
    currentPage: Int
    perPage: Int
  }

  type PaginatedCategories {
    data: [Category]
    meta: PaginatedMetaData
  }

  type CategoryStatistics {
    total: Int
  }

  input CategoryInput {
    name: String!
    description: String
  }

  input UpdateCategoryInput {
    name: String
    description: String
  }

  type Query {
    allCategories(page: Int = 1, limit: Int = 10): PaginatedCategories
    categoryDetails(id: ID!): Category
    categoryStats: CategoryStatistics
  }

  type Mutation {
    addCategory(input: CategoryInput!): Category
    updateCategory(id: ID!, input: UpdateCategoryInput!): Category
    deleteCategory(id: ID!): String
  }
`;
