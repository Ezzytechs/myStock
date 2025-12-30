const User = require("../user.model");
const { generateTokens, verifyRefresh } = require("../../../utils/auth");
const { AppError } = require("../../../utils/appErrors");

exports.registerUser = async ({ username, email, password }, res) => {
  try {
    const exists = await User.findOne({ email });
    if (exists) throw AppError.conflict("User already exists");
    const user = await User.create({ username, email, password });
    const { accessToken } = generateTokens(user, res);
    return accessToken;
  } catch (error) {
    throw AppError.internal(error.message);
  }
};

exports.loginUser = async (email, password, res) => {
  try {
    const user = await User.findOne({ email });
    if (!user) throw AppError.notFound("User not found");
    const valid = await user.comparePassword(password);
    if (!valid) throw AppError.unauthorized("Invalid credentials");
    const { accessToken } = generateTokens(user, res);
    return accessToken;
  } catch (error) {
    throw AppError.internal(error.message);
  }
};

exports.refreshToken = async (user, token, res) => {
  try {
    const { accessToken } = verifyRefresh(user, token, res);
    return accessToken;
  } catch (error) {
    throw AppError.internal(error.message);
  }
};

exports.logoutUser = async (res) => {
  try {
    res.clearCookie("refreshToken");
    return "Logged out successfully";
  } catch (error) {
    throw AppError.internal(error.message);
  }
};
