const { mergeTypeDefs } = require("@graphql-tools/merge");
const { mergeResolvers } = require("@graphql-tools/merge");

// import typeDefs and resolvers
const stockTypeDefs = require("./stock/stock.schema");
const stockResolvers = require("./stock/stock.resolver");
const profileResolvers = require("./user/profile/profile.resolver");
const profileTypeDefs = require("./user/profile/profile.schema");
const authResolvers = require("./user/auth/auth.resolver");
const authTypeDefs = require("./user/auth/auth.schema");
const categoryResolvers = require("./category/category.resolver");
const categoryTypeDefs = require("./category/category.schema");
const unitResolvers = require("./unit/unit.resolver");
const unitTypeDefs = require("./unit/unit.schema");
const accountingResolvers = require("./accounting/accounting.resolver");
const accountingTypeDefs = require("./accounting/accounting.schema");
// merge typeDefs and resolvers
module.exports = {
  typeDefs: mergeTypeDefs([
    stockTypeDefs,
    profileTypeDefs,
    authTypeDefs,
    categoryTypeDefs,
    unitTypeDefs,
    accountingTypeDefs,
  ]),
  resolvers: mergeResolvers([
    stockResolvers,
    profileResolvers,
    authResolvers,
    categoryResolvers,
    unitResolvers,
    accountingResolvers,
  ]),
};
