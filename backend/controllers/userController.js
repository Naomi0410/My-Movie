import User from "../models/User.js";
import Account from "../models/Account.js";
import bcrypt from "bcryptjs";
import asyncHandler from "../middlewares/asyncHandler.js";
import createToken from "../utils/createToken.js";

const TMDB_API_KEY = "1bc6fa4a28441fb34163e0d25bec8c20";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// 📝 Register a new user
const createUser = asyncHandler(async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  if (!firstname || !lastname || !email || !password) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const newUser = new User({ firstname, lastname, email, password });
  await newUser.save();

  createToken(res, newUser._id);

  res.status(201).json({
    _id: newUser._id,
    firstname: newUser.firstname,
    lastname: newUser.lastname,
    email: newUser.email,
    isAdmin: newUser.isAdmin,
    createdAt: newUser.createdAt,
  });
});

// 🔐 Login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  const isPasswordValid = await user.matchPassword(password);
  if (!isPasswordValid) {
    res.status(401);
    throw new Error("Invalid password");
  }

  createToken(res, user._id);

  res.status(200).json({
    _id: user._id,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    isAdmin: user.isAdmin,
    createdAt: user.createdAt,
  });
});

// 🚪 Logout user
const logoutCurrentUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logged out successfully" });
});

// 👥 Get all users (admin only)
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password");
  res.status(200).json(users);
});

// 🙋‍♂️ Get current user's profile
const getCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.status(200).json(user);
});

// ✏️ Update current user's profile
const updateCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.firstname = req.body.firstname || user.firstname;
  user.lastname = req.body.lastname || user.lastname;
  user.email = req.body.email || user.email;

  if (req.body.password) {
    user.password = req.body.password;
  }

  const updatedUser = await user.save();

  res.status(200).json({
    _id: updatedUser._id,
    firstname: updatedUser.firstname,
    lastname: updatedUser.lastname,
    email: updatedUser.email,
    isAdmin: updatedUser.isAdmin,
    createdAt: updatedUser.createdAt,
  });
});

// 🧹 Delete local user account
const deleteUserAccount = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  // Delete associated account
  const deletedAccount = await Account.findOneAndDelete({ user: user._id });
  if (deletedAccount) {
    console.log("Deleted account for user:", user._id);
  } else {
    console.log("No account found for user:", user._id);
  }
  // Delete user
  await user.deleteOne();
  console.log("Deleted user:", user._id);
  // Clear JWT cookie
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res
    .status(200)
    .json({ msg: "User and associated account deleted successfully" });
});

// 🎬 TMDb: Create guest session
const createGuestSession = asyncHandler(async (req, res) => {
  const response = await fetch(
    `${TMDB_BASE_URL}/authentication/guest_session/new?api_key=${TMDB_API_KEY}`
  );
  const data = await response.json();

  if (data.success) {
    res.status(200).json({ guest_session_id: data.guest_session_id });
  } else {
    res.status(500);
    throw new Error("Failed to create guest session");
  }
});

// 🔑 TMDb: Create request token
const createRequestToken = asyncHandler(async (req, res) => {
  const response = await fetch(
    `${TMDB_BASE_URL}/authentication/token/new?api_key=${TMDB_API_KEY}`
  );
  const data = await response.json();

  if (data.success) {
    res.status(200).json({ request_token: data.request_token });
  } else {
    res.status(500);
    throw new Error("Failed to create request token");
  }
});

// 🔐 TMDb: Validate token with login
const validateTokenWithLogin = asyncHandler(async (req, res) => {
  const { email, password, request_token } = req.body;

  const response = await fetch(
    `${TMDB_BASE_URL}/authentication/token/validate_with_login?api_key=${TMDB_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, request_token }),
    }
  );

  const data = await response.json();

  if (data.success) {
    res.status(200).json({ validated_token: data.request_token });
  } else {
    res.status(401);
    throw new Error("TMDb login failed");
  }
});

// 🧾 TMDb: Create session
const createSession = asyncHandler(async (req, res) => {
  const { request_token } = req.body;

  const response = await fetch(
    `${TMDB_BASE_URL}/authentication/session/new?api_key=${TMDB_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ request_token }),
    }
  );

  const data = await response.json();

  if (data.success) {
    res.status(200).json({ session_id: data.session_id });
  } else {
    res.status(500);
    throw new Error("Failed to create TMDb session");
  }
});

// 🧹 TMDb: Delete session
const deleteSession = asyncHandler(async (req, res) => {
  const { session_id } = req.body;

  const response = await fetch(
    `${TMDB_BASE_URL}/authentication/session?api_key=${TMDB_API_KEY}`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id }),
    }
  );

  const data = await response.json();

  if (data.success) {
    res.status(200).json({ message: "TMDb session deleted" });
  } else {
    res.status(500);
    throw new Error("Failed to delete TMDb session");
  }
});

export {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteUserAccount,
  createGuestSession,
  createRequestToken,
  validateTokenWithLogin,
  createSession,
  deleteSession,
};
