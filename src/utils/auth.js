const { ForbiddenError } = require("apollo-server-express");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

exports.generateTokens = (user, res) => {
  const accessToken = jwt.sign(
    { sub: user.id, role: user.role },
    ACCESS_SECRET,
    { expiresIn: "1d" }
  );

  const refreshToken = jwt.sign(
    { sub: user.id, role: user.role, username: user.username },
    REFRESH_SECRET,
    { expiresIn: "7d" }
  );
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "Lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return { accessToken };
};

exports.verifyAccess = (token) => {
  try {
    return jwt.verify(token, ACCESS_SECRET);
  } catch {
    return null;
  }
};

exports.verifyRefresh = async (user, token, res) => {
  try {
    const verify = jwt.verify(token, REFRESH_SECRET);
    if (!verify) throw new Error("Invalid refresh token");
    const { accessToken } = this.generateTokens(user, res);
    return accessToken;
  } catch {
    return null;
  }
};

exports.requireAuth = (resolver) => {
  return (parent, args, context, info) => {
    if (!context.user) {
      throw new Error("Unauthorized: You must be logged in");
    }
    return resolver(parent, args, context, info);
  };
};

exports.requireRole = (userRole, allowedRoles) => {
  if (!allowedRoles.includes(userRole)) {
    throw new ForbiddenError("Unauthorized Access!");
  }
};
