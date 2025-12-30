const {
  addUnit,
  getAllUnits,
  getUnitById,
  updateUnit,
  deleteUnit,
  getUnitStats,
} = require("./unit.service");

const { requireRole } = require("../../utils/auth");

module.exports = {
  Query: {
    allUnits: async (_parent, args, { user }) => {
      requireRole(user.role, ["admin", "user"]);
      const { page, limit } = args;
      return getAllUnits(page, limit);
    },
    unitDetails: (_parent, args) => {
      return getUnitById(args.id);
    },
    unitStats: (_parent, _, { user }) => {
      requireRole(user.role, ["admin"]);
      return getUnitStats();
    },
  },
  Mutation: {
    addUnit: async (_parent, { input }, { user }) => {
      requireRole(user.role, ["admin", "user"]);
      input.owner = user.sub;
      return addUnit(input);
    },

    updateUnit: async (_parent, { id, input }, { user }) => {
      requireRole(user.role, ["admin", "user"]);
      if (user.role !== "admin" && user.sub !== input.owner) {
        throw AppError.unauthorized("Unauthorized");
      }
      return updateUnit(id, input);
    },

    deleteUnit: async (_parent, { id }, { user }) => {
      requireRole(user.role, ["admin"]);
      return deleteUnit(id);
    },
  },
};
