const {
  getAllAccountings,
  getAccountingById,
  updateAccounting,
  deleteAccounting,
  getAccountingStats,
} = require("./accounting.service");

const { requireRole } = require("../../utils/auth");

module.exports = {
  Query: {
    allAccountings: async (_parent, args, { user }) => {
      const { page, limit, ...restArgs } = args;
      const filter =
        user.role === "admin"
          ? { ...restArgs }
          : { ...restArgs, owner: (restArgs.owner = user.sub) };
      return getAllAccountings(page, limit, filter);
    },
    accountingDetails: (_parent, args, { user }) => {
      const filter =
        user.role === "admin"
          ? { id: args.id }
          : { id: args.id, owner: user.sub };
      return getAccountingById(filter);
    },

    accountingStatsByFilter: (_parent, args, { user }) => {
      const filter =
        user.role === "admin"
          ? { ...args }
          : { ...args, owner: (args.owner = user.sub) };
      return getAccountingStatsByFilter(filter);
    },
    getAccountingStats: (_parent, args, { user }) => {
      const filter =
        user.role === "admin"
          ? { ...args }
          : { ...args, owner: (args.owner = user.sub) };
      return getAccountingStats(filter);
    },
    accountingSummaryByRemark: (_parent, args, { user }) => {
      const filter =
        user.role === "admin"
          ? { ...args }
          : { ...args, owner: (args.owner = user.sub) };
      return getAccountingSummaryByRemark(filter);
    },
    allTimeProfit: (_parent, args, { user }) => {
      const filter =
        user.role === "admin"
          ? { ...args }
          : { ...args, owner: (args.owner = user.sub) };
      return getAllTimeProfit(filter);
    },

    yearlyAccountingBreakdown: (_parent, args, { user }) => {
      const filter =
        user.role === "admin"
          ? { ...args }
          : { ...args, owner: (args.owner = user.sub) };
      return getYearlyAccountingBreakdown(filter);
    },

    totalNetChangeByYearAndRemark: (_parent, args, { user }) => {
      const filter =
        user.role === "admin"
          ? { ...args }
          : { ...args, owner: (args.owner = user.sub) };
      return getTotalNetChangeByYearAndRemark(filter);
    },
  },
  Mutation: {
    updateAccounting: async (_parent, { id, input }, { user }) => {
      const filter = user.role === "admin" ? { id } : { id, owner: user.sub };
      return updateAccounting(filter, input);
    },

    deleteAccounting: async (_parent, { id }, { user }) => {
      const filter = user.role === "admin" ? { id } : { id, owner: user.sub };
      return deleteAccounting(filter);
    },
  },
};
