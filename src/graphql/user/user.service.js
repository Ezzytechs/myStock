const User = require("./user.model");
const { generateTokens, requireRole } = require("../../utils/auth");
const { paginate } = require("../../utils/paginate");

exports.registerUser = async ({ username, email, password }, res) => {
  const exists = await User.findOne({ email });
  if (exists) throw new Error("User already exists");
  const user = await User.create({ username, email, password });
  const { accessToken } = generateTokens(user, res);
  return accessToken;
};

exports.loginUser = async (email, password, res) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");
  const valid = await user.comparePassword(password);
  if (!valid) throw new Error("Invalid credentials");
  const { accessToken } = generateTokens(user, res);
  return accessToken;
};

exports.getAllUsers = async (page, limit) => {
  return await paginate(User, {
    page,
    limit,
    select: "-password",
  });
};

exports.getUserById = async (id) => await User.findById(id);

exports.updateUser = async (id, updates) =>
  await User.findByIdAndUpdate(id, { ...updates }, { new: true });

exports.deleteUser = async (id) => {
  await User.findByIdAndDelete(id);
  return "User deleted";
};

exports.getUserStats = async (role) => {
  requireRole(role, ["admin"]);
  const [all, admins, users] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: "admin" }),
    User.countDocuments({ role: "user" }),
  ]);
  return { all, users, admins };
};
