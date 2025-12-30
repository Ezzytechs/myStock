const { requireRole } = require("../../../utils/auth");
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserStats,
  toggleRole,
} = require("./profile.service");

module.exports = {
  Query: {
    me: (_, __, { user }) => {
      return getUserById(user.sub);
    },

    users: async (_, args, { user }) => {
      requireRole(user.role, ["admin"]);
      const { page, limit } = args;
      const users = await getAllUsers(page, limit);
      return users;
    },
    userStats: async (_, __, { user }) => {
      const userStats = await getUserStats(user.role);
      return userStats;
    },
    getUser: (_, { id }, { user }) => {
      requireRole(user.role, ["admin"]);
      return getUserById(id);
    },
  },
  Mutation: {
    updateUser: (_, { input }, { user }) => {
      return updateUser(user.sub, input);
    },
    toggleRole: (_, { id }, { user }) => {
      requireRole(user.role, ["admin"]);
      return toggleRole(id);
    },
    deleteUser: (_, { id }, { user }) => {
      requireRole(user.role, ["admin"]);
      return deleteUser(id);
    },
  },
};
