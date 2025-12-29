const {
  getAllStocks,
  getAllStocks,
  getStockById,
  deleteStock,
  updateStock,
  addStock,
  getStocksByCategory,
  getStocksByUnit,
  getStocksByStatus,
  getStockStats,
} = require("./stock.service");

const { requireRole } = require("../../utils/auth");

module.exports = {
  Query: {
    stockDetails: (_, args) => {
      return getStockById(args.id);
    },
    allStocks: async (_, args) => {
      requireRole(["admin"]);
      const { page, limit } = args;
      return getAllStocks(page, limit);
    },
    userStocks: (_, _, { user }) => {
      const id = user.role === "user" ? user.id : null;
      return getUserStocks(id);
    },
    StocksByCategory: (_, args, { user }) => {
      const id = user.role === "user" ? user.id : null;
      return getStocksByCategory(id, args.category);
    },
    StocksByUnit: (_, args, { user }) => {
      const id = user.role === "user" ? user.id : null;
      return getStocksByUnit(id, args.unit);
    },
    StocksByStatus: (_, args, { user }) => {
      const id = user.role === "user" ? user.id : null;
      return getStocksByStatus(id, args.status);
    },
    stockStats: (_, _, { user }) => {
      const id = user.role === "user" ? user.id : null;
      return getStockStats(id);
    },
  },
  Mutation: {
    addStock: async (_, { input }, { user }) => {
      const id = user.role === "user" ? user.id : null;
      input.owner = id;
      return addStock(input);
    },
    deleteStock: async (_, { id }, { user }) => {
      const userId = user.role === "user" ? user.id : null;
      return deleteStock(id, userId);
    },

    updateStock: async (_, { id, input }, { user }) => {
      const userId = user.role === "user" ? user.id : null;
      return updateStock(id, input, userId);
    },
  },
};
