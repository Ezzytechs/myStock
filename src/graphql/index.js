const { mergeTypeDefs } = require("@graphql-tools/merge");
const { mergeResolvers } = require("@graphql-tools/merge");

// import typeDefs and resolvers
const userTypeDefs = require("./user/user.schema");
const userResolvers = require("./user/user.resolver");
const stockTypeDefs = require("./stock/stock.schema");
const stockResolvers = require("./stock/stock.resolver");

// merge typeDefs and resolvers
module.exports = {
  typeDefs: mergeTypeDefs([userTypeDefs, stockTypeDefs]),
  resolvers: mergeResolvers([userResolvers, stockResolvers]),
};
