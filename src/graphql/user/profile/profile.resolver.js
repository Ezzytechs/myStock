const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserStats,
} = require("./profile.service");

module.exports = {
  Query: {
    me: (_, __, { user }) => {
      if (!user) throw new Error("Unauthorized");
      return getUserById(user.id);
    },

    users: async (_, args, { user }) => {
      requireRole(user.role, "admin");
      const { page, limit } = args;
      const users = await getAllUsers(page, limit);
      return users;
    },
    userStats: async (_, __, { user }) => {
      const userStats = await getUserStats(user.role);
      return userStats;
    },
    getUser: (_, { id }, { user }) => {
      requireRole(user.role, "admin");
      return getUserById(id);
    },
  },
  Mutation: {
    updateUser: (_, { input }, { user }) => {
      return updateUser(user.id, input);
    },

    deleteUser: (_, { id }, { user }) => {
      requireRole(user.role, "admin");
      return deleteUser(id);
    },
  },
};
