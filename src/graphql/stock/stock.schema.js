const { gql } = require("apollo-server-express");

module.exports = gql`
  type Accounting {
    id: ID!
    stock: ID!
    amountBeforeExpense: Float!
    amountAfterExpense: Float!
    leastSale: Float!
    netChange: Float!
    remark: String!
    owner: ID!
    createdAt: String!
    updatedAt: String!
  }

  type Stock {
    id: ID!
    name: String!
    category: String!
    unit: String!
    quantity: Int!
    price: Float!
    owner: ID!
    status: String!
    accounting: Accounting
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
    allStocks(page: Int = 1, limit: Int = 10): PaginatedStocks
    stockDetails(id: ID!): Stock
    userStocks(id: ID!): [Stock]
    stocksByCategory(id: ID!, category: String!): [Stock]
    stocksByUnit(id: ID!, unit: String!): [Stock]
    stocksByStatus(id: ID!, status: String!): [Stock]
    stocksByYear(id: ID!, year: Int!): [Stock]
    stockStats: StockStatistics
  }

  type Mutation {
    addStock(input: StockInput!): Stock
    updateStock(id: ID!, input: UpdateStockInput!): Stock
    deleteStock(id: ID!): String
  }
`;
