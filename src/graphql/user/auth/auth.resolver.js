const {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
} = require("./auth.service");

module.exports = {
  Query: {},
  Mutation: {
    register: async (_, { input }, { res }) => {
      try {
        const accessToken = await registerUser(input, res);
        return { accessToken };
      } catch (error) {
        throw error;
      }
    },

    logout: async (_, __, { res }) => {
      try {
        const accessToken = await logoutUser(res);
        return accessToken;
      } catch (error) {
        throw error;
      }
    },

    login: async (_parent, args, { res }) => {
      const { email, password } = args;
      const accessToken = await loginUser(email, password, res);
      return { accessToken };
    },

    refreshToken: async (_, __, { req, res, user }) => {
      const token = req.cookies.refreshToken;
      const accessToken = await refreshToken(user, token, res);
      return accessToken;
    },
  },
};
