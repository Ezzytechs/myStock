const {
  getAllStocks,
  getStockById,
  deleteStock,
  updateStock,
  addStock,
  getUserStocks,
  getStocksByCategory,
  getStocksByUnit,
  getStocksByStatus,
  getStockStats,
  getStockByYear,
} = require("./stock.service");

const { requireRole } = require("../../utils/auth");

module.exports = {
  Query: {
    allStocks: async (_parent, args, { user }) => {
      requireRole(["admin"], user.role);
      const { page, limit } = args;
      return getAllStocks(page, limit);
    },
    stockDetails: (_parent, args) => {
      return getStockById(args.id);
    },
    userStocks: (_parent, { user }) => {
      const id = user.role === "user" ? user.id : null;
      return getUserStocks(id);
    },
    stocksByCategory: (_parent, args, { user }) => {
      const id = user.role === "user" ? user.id : null;
      return getStocksByCategory(id, args.category);
    },
    stocksByUnit: (_parent, args, { user }) => {
      const id = user.role === "user" ? user.id : null;
      return getStocksByUnit(id, args.unit);
    },
    stocksByStatus: (_parent, args, { user }) => {
      const id = user.role === "user" ? user.id : null;
      return getStocksByStatus(id, args.status);
    },
    stockStats: (_parent, _, { user }) => {
      const id = user.role === "user" ? user.id : null;
      return getStockStats(id);
    },
    stocksByYear: (_parent, args, { user }) => {
      const id = user.role === "user" ? user.id : null;
      return getStockByYear(id, args.year);
    },
  },
  Mutation: {
    addStock: async (_parent, { input }, { user }) => {
      const id = user.role === "user" ? user.id : null;
      input.owner = id;
      return addStock(input);
    },

    updateStock: async (_parent, { id, input }, { user }) => {
      const userId = user.role === "user" ? user.id : null;
      return updateStock(id, input, userId);
    },

    deleteStock: async (_parent, { id }, { user }) => {
      const userId = user.role === "user" ? user.id : null;
      return deleteStock(id, userId);
    },
  },
};
