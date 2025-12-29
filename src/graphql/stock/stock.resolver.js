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
    allStocks: async (_, args) => {
      requireRole(["admin"]);
      const { page, limit } = args;
      return getAllStocks(page, limit);
    },
    stockDetails: (_, args) => {
      return getStockById(args.id);
    },
    userStocks: (_, _, { user }) => {
      const id = user.role === "user" ? user.id : null;
      return getUserStocks(id);
    },
    stocksByCategory: (_, args, { user }) => {
      const id = user.role === "user" ? user.id : null;
      return getStocksByCategory(id, args.category);
    },
    stocksByUnit: (_, args, { user }) => {
      const id = user.role === "user" ? user.id : null;
      return getStocksByUnit(id, args.unit);
    },
    stocksByStatus: (_, args, { user }) => {
      const id = user.role === "user" ? user.id : null;
      return getStocksByStatus(id, args.status);
    },
    stockStats: (_, _, { user }) => {
      const id = user.role === "user" ? user.id : null;
      return getStockStats(id);
    },
    getStockByYear: (_, args, { user }) => {
      const id = user.role === "user" ? user.id : null;
      return getStockByYear(id, args.year);
    },
  },
  Mutation: {
    addStock: async (_, { input }, { user }) => {
      const id = user.role === "user" ? user.id : null;
      input.owner = id;
      return addStock(input);
    },

    updateStock: async (_, { id, input }, { user }) => {
      const userId = user.role === "user" ? user.id : null;
      return updateStock(id, input, userId);
    },

    deleteStock: async (_, { id }, { user }) => {
      const userId = user.role === "user" ? user.id : null;
      return deleteStock(id, userId);
    },
  },
};
