const {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
  generateOtp,
  resetPassword,
  changePassword,
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

    logout: async (_, __, { res }) => {
      try {
        const accessToken = await logoutUser(res);
        return accessToken;
      } catch (error) {
        throw error;
      }
    },
    generateOtp: async (_, { email }) => {
      try {
        const otp = await generateOtp(email);
        return otp;
      } catch (error) {
        throw error;
      }
    },
    resetPassword: async (_, { email, otp, password }) => {
      try {
        const result = await resetPassword(email, otp, password);
        return result;
      } catch (error) {
        throw error;
      }
    },
    changePassword: async (_, { email, password }) => {
      try {
        const result = await changePassword(email, password);
        return result;
      } catch (error) {
        throw error;
      }
    },
  },
};
