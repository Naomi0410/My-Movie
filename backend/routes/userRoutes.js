import express from "express";

// Controllers
import {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  createGuestSession,
  createRequestToken,
  validateTokenWithLogin,
  createSession,
  deleteSession,
  deleteUserAccount
} from "../controllers/userController.js";

// Middlewares
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 📝 Local Auth Routes
router.route("/")
  .post(createUser) // Register
  .get(authenticate, authorizeAdmin, getAllUsers); // Admin-only: Get all users

router.post("/auth", loginUser); // Login
router.post("/logout", logoutCurrentUser); // Logout

router.route("/profile")
  .get(authenticate, getCurrentUserProfile) // Get profile
  .put(authenticate, updateCurrentUserProfile) // Update profile
  .delete(authenticate, deleteUserAccount); // Delete profile

// 🎬 TMDb Auth Routes
router.get("/tmdb/guest-session", createGuestSession); // Guest session
router.get("/tmdb/request-token", createRequestToken); // Request token
router.post("/tmdb/validate-login", validateTokenWithLogin); // Validate token with login
router.post("/tmdb/create-session", createSession); // Create session
router.delete("/tmdb/delete-session", deleteSession); // Delete session



export default router;
