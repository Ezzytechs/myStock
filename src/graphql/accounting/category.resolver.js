const {
  addCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getCategoryStats,
} = require("./category.service");

const { requireRole } = require("../../utils/auth");

module.exports = {
  Query: {
    allCategories: async (_parent, args, { user }) => {
      requireRole(user.role, ["admin", "user"]);
      const { page, limit } = args;
      return getAllCategories(page, limit);
    },
    categoryDetails: (_parent, args) => {
      return getCategoryById(args.id);
    },
    categoryStats: (_parent, _, { user }) => {
      requireRole(user.role, ["admin"]);
      return getCategoryStats();
    },
  },
  Mutation: {
    addCategory: async (_parent, { input }, { user }) => {
      requireRole(user.role, ["admin", "user"]);
      input.owner = user.sub;
      return addCategory(input);
    },

    updateCategory: async (_parent, { id, input }, { user }) => {
      requireRole(user.role, ["admin", "user"]);
      if (user.role !== "admin" && user.sub !== input.owner) {
        throw AppError.unauthorized("Unauthorized");
      }
      return updateCategory(id, input);
    },

    deleteCategory: async (_parent, { id }, { user }) => {
      requireRole(user.role, ["admin"]);
      return deleteCategory(id);
    },
  },
};
