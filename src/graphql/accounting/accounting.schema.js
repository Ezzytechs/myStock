const { gql } = require("apollo-server-express");

module.exports = gql`
  type Owner {
    username: String
    email: String
    role: String
  }
  type Category {
    name: String
  }

  type Accounting {
    id: ID!
    stock: Stock!
    amountBeforeExpense: Float!
    amountAfterExpense: Float!
    leastSale: Float!
    netChange: Float!
    remark: String!
    owner: Owner
    createdAt: String!
    updatedAt: String!
  }
  type Stock {
    id: ID!
    category: Category
    unit: String!
    quantity: Int!
    price: Float!
    owner: Owner
    status: String!
  }

  type StockStatistics {
    open: Int
    closed: Int
    total: Int
  }

  type PaginatedMetaData {
    totalItems: Int
    totalPages: Int
    currentPage: Int
    perPage: Int
  }

  type PaginatedAccountings {
    data: [Accounting]
    meta: PaginatedMetaData
  }

  type AccountingStatisticsByFilter {
    total: Int
  }
  type AccountingStatistics {
    total: Int
    profit: Int
    loss: Int
    neutral: Int
    initial: Int
  }

  input AccountingFilterInput {
    owner: ID
    stock: ID
    remark: String
    dateSold: Date
  }

  input AccountingInput {
    stock: ID!
    amountBeforeExpense: Float!
    amountAfterExpense: Float!
    leastSale: Float!
    netChange: Float!
    remark: String!
    owner: ID!
  }

  input UpdateAccountingInput {
    stock: ID!
    amountBeforeExpense: Float
    amountAfterExpense: Float
    dateSold: Date
    leastSale: Float
    netChange: Float
    remark: String
    owner: ID
  }
  type AccountingSummaryByRemark {
    profit: Float
    loss: Float
    neutral: Float
  }
  type AllTimeProfit {
    allTimeProfit: Float
  }
  type Query {
    allAccountings(
      page: Int = 1
      limit: Int = 10
      filter: AccountingFilterInput
    ): PaginatedAccountings
    accountingDetails(id: ID!): Accounting
    accountingStats: AccountingStatistics
    accountingStatsByFilter(
      filter: AccountingFilterInput
    ): AccountingStatisticsByFilter
    accountingSummaryByRemark(
      filter: AccountingFilterInput
    ): AccountingSummaryByRemark
    allTimeProfit(filter: AccountingFilterInput): AllTimeProfit
  }

  type Mutation {
    addAccounting(input: AccountingInput!): Accounting
    updateAccounting(id: ID!, input: UpdateAccountingInput!): Accounting
    deleteAccounting(id: ID!): String
  }
`;
