const { gql } = require("apollo-server-express");

module.exports = gql`
  type Stock {
    id: ID!
    name: String!
    category: String!
    unit: String!
    quantity: Int!
    price: Float!
    owner: ID!
    status: String!
  }

  type PaginatedMetaData {
    totalItems: Int
    totalPages: Int
    currentPage: Int
    perPage: Int
  }

  type PaginatedStocks {
    data: [Stock]
    meta: PaginatedMetaData
  }

  type StockStatistics {
    open: Int
    closed: Int
    total: Int
  }

  input StockInput {
    name: String!
    category: String!
    unit: String!
    quantity: Int!
    price: Float!
    owner: ID!
    status: String!
  }

  input UpdateStockInput {
    name: String
    category: String
    unit: String
    quantity: Int
    price: Float
    owner: ID
    status: String
  }

  type Query {
    stocks(page: Int = 1, limit: Int = 10): PaginatedStocks
    stockById(id: ID!): Stock
    userStocks(id: ID!): [Stock]
    userStocksByCategory(id: ID!, category: String!): [Stock]
    userStocksByUnit(id: ID!, unit: String!): [Stock]
    userStocksByStatus(id: ID!, status: String!): [Stock]
    stockStats: StockStatistics
  }

  type Mutation {
    addStock(input: StockInput!): Stock
    updateStock(id: ID!, input: UpdateStockInput!): Stock
    deleteStock(id: ID!): String
  }
`;
