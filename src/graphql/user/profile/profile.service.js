const User = require("../user.model");
const { generateTokens, requireRole } = require("../../../utils/auth");
const { AppError } = require("../../../utils/appErrors");
const { paginate } = require("../../../utils/paginate");

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

exports.getAllUsers = async (page, limit) => {
  try {
    return await paginate(User, {
      page,
      limit,
      select: "-password -otp",
    });
  } catch (error) {
    throw AppError.internal(error.message);
  }
};

exports.getUserById = async (id) => {
  try {
    return User.findById(id).select("-password -otp");
  } catch (error) {
    throw AppError.internal(error.message);
  }
};

exports.updateUser = async (id, updates) => {
  try {
    return User.findByIdAndUpdate(id, { ...updates }, { new: true }).select(
      "-password -otp"
    );
  } catch (error) {
    throw AppError.internal(error.message);
  }
};

exports.deleteUser = async (id) => {
  try {
    await User.findByIdAndDelete(id);
    return "User deleted";
  } catch (error) {
    throw AppError.internal(error.message);
  }
};

exports.toggleRole = async (id) => {
  try {
    const user = await User.findById(id);
    if (!user) throw AppError.notFound("User not found");
    user.role = user.role === "admin" ? "user" : "admin";
    await user.save();
    return user;
  } catch (error) {
    throw AppError.internal(error.message);
  }
};

exports.getUserStats = async (role) => {
  try {
    const [all, admins, users] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "admin" }),
      User.countDocuments({ role: "user" }),
    ]);
    return { all, users, admins };
  } catch (error) {
    throw AppError.internal(error.message);
  }
};
