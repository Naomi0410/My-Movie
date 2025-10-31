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
  deleteUserAccount,
  refreshAccessToken
} from "../controllers/userController.js";

// Middlewares
import { authenticate } from "../middlewares/authMiddleware.js";
import limitRequests from "../middlewares/rateLimit.js";

const router = express.Router();

// 📝 Local Auth Routes
router.route("/")
  .post(limitRequests, createUser) // Register (rate-limited)
  .get(authenticate,  getAllUsers); // Admin-only: Get all users

router.post("/refresh-token", refreshAccessToken);


router.post("/auth", limitRequests, loginUser); // Login (rate-limited)
router.post("/logout", authenticate, logoutCurrentUser); // Logout (protected)

router.route("/profile")
  .get(authenticate, getCurrentUserProfile) // Get profile
  .put(authenticate, updateCurrentUserProfile) // Update profile
  .delete(authenticate, deleteUserAccount); // Delete profile

// 🎬 TMDb Auth Routes (rate-limited)
router.get("/tmdb/guest-session", limitRequests, createGuestSession);
router.get("/tmdb/request-token", limitRequests, createRequestToken);
router.post("/tmdb/validate-login", limitRequests, validateTokenWithLogin);
router.post("/tmdb/create-session", limitRequests, createSession);
router.delete("/tmdb/delete-session", limitRequests, deleteSession);


export default router;
