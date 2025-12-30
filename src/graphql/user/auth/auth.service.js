require("module-alias/register");
const User = require("../user.model");
const { generateTokens, verifyRefresh } = require("@utils/auth");
const { AppError } = require("@utils/appErrors");

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
exports.generateOtp = async (email) => {
  try {
    const user = await User.findOne({ email });
    if (!user) throw AppError.notFound("User not found");
    const otp = Math.floor(100000 + Math.random() * 900000);
    user.otp = otp;
    await user.save();
    return otp;
  } catch (error) {
    throw AppError.internal(error.message);
  }
};

exports.resetPassword = async (email, otp, password) => {
  try {
    const user = await this.verifyOtp(email, otp);
    if (!user) throw AppError.unauthorized("Invalid OTP");
    user.password = password;
    await user.save();
    return true;
  } catch (error) {
    throw AppError.internal(error.message);
  }
};

exports.changePassword = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (!user) throw AppError.notFound("User not found");
    if (!user.comparePassword(password))
      throw AppError.unauthorized("Invalid password");
    user.password = password;
    await user.save();
    return true;
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

//UTILS
exports.verifyOtp = async (email, otp) => {
  try {
    const user = await User.findOne({
      email,
      otp: { otpExpiry: { $gt: new Date() }, otpCode: otp },
    });
    if (!user) throw AppError.notFound("User not found");
    user.otp = { otpExpiry: null, otpCode: null };
    await user.save();
    return user;
  } catch (error) {
    throw AppError.internal(error.message);
  }
};
