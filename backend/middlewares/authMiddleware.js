import jwt from "jsonwebtoken";
import User from "../models/User.js";
import asyncHandler from "./asyncHandler.js";

// Check if the user is authenticated or not
const authenticate = asyncHandler(async (req, res, next) => {
  console.log("Cookies:", req.cookies);
  console.log("Headers:", req.headers);
  let token = req.cookies.jwt;
  if (!token) {
    console.log("No jwt cookie found");
  }
  // Fallback to Authorization header
  if (!token && req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (token) {
    try {
      const JWT_ACCESS_TOKEN = process.env.JWT_ACCESS_TOKEN;
      const decoded = jwt.verify(token, JWT_ACCESS_TOKEN);
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed.");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

export { authenticate };
