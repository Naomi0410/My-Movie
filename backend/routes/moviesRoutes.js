import express from "express";
const router = express.Router();

// Controllers
import {
  getTMDbMovieList,
  getTMDbMovieDetails,
  getTMDbMovieCredits,
  getTMDbRecommendations,
  getTMDbReleaseDates,
  movieReview,
  deleteComment,
  getMovieReviews,
  getMovieRating,
} from "../controllers/movieController.js";

// Middlewares
import { authenticate } from "../middlewares/authMiddleware.js";
import limitRequests from "../middlewares/rateLimit.js";

// 🌍 TMDb Public Routes (rate-limited)
router.get("/tmdb/list/:type", limitRequests, getTMDbMovieList); // popular | top_rated | upcoming | now_playing
router.get("/tmdb/details/:tmdbId", limitRequests, getTMDbMovieDetails);
router.get("/tmdb/credits/:tmdbId", limitRequests, getTMDbMovieCredits);
router.get("/tmdb/recommendations/:tmdbId", limitRequests, getTMDbRecommendations);
router.get("/tmdb/release-dates/:tmdbId", limitRequests, getTMDbReleaseDates);

// ⭐ Local Review Routes (rate-limited + auth where needed)
router.post("/tmdb/:tmdbId/reviews", limitRequests, authenticate, movieReview);
router.get("/tmdb/:tmdbId/reviews", limitRequests, getMovieReviews);
router.get("/tmdb/:tmdbId/rating", limitRequests, getMovieRating);
router.delete("/tmdb/reviews/delete", limitRequests, authenticate, deleteComment);

export default router;
