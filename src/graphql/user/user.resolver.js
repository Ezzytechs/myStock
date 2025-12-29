const {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserStats,
} = require("./user.service");

const {
  verifyRefresh,
  generateTokens,
  requireRole,
} = require("../../utils/auth");

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
    /* getUser: (_, { id }, { user }) => {
      requireAuth(user);
      return getUserById(id);
    },*/
  },
  Mutation: {
    register: async (_, { input }, { res }) => {
      try {
        const accessToken = await registerUser(input, res);
        return { accessToken };
      } catch (error) {
        console.log(error);
        throw error;
      }
    },

    logout: (_, __, { res }) => {
      res.clearCookie("token");
      return "Logged out";
    },

    login: async (_parent, args, { res }) => {
      const { email, password } = args;
      const accessToken = await loginUser(email, password, res);
      return { accessToken };
    },

    updateUser: (_, { input }, { user }) => {
      return updateUser(user.id, input);
    },

    refreshToken: async (_, __, { req, res, user }) => {
      const token = req.cookies.refreshToken;
      const accessToken = await verifyRefresh(user, token, res);
      if (!accessToken) throw new Error("Invalid refresh token");
      return accessToken;
    },

    deleteUser: (_, { id }, { user }) => {
      requireRole(user.role, "admin");
      return deleteUser(id);
    },
  },
};
