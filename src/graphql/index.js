const { mergeTypeDefs } = require("@graphql-tools/merge");
const { mergeResolvers } = require("@graphql-tools/merge");

// import typeDefs and resolvers
const stockTypeDefs = require("./stock/stock.schema");
const stockResolvers = require("./stock/stock.resolver");
const profileResolvers = require("./user/profile/profile.resolver");
const profileTypeDefs = require("./user/profile/profile.schema");
const authResolvers = require("./user/auth/auth.resolver");
const authTypeDefs = require("./user/auth/auth.schema");

// merge typeDefs and resolvers
module.exports = {
  typeDefs: mergeTypeDefs([stockTypeDefs, profileTypeDefs, authTypeDefs]),
  resolvers: mergeResolvers([stockResolvers, profileResolvers, authResolvers]),
};
