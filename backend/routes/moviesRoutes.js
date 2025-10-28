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

// 🌍 TMDb Public Routes
router.get("/tmdb/list/:type", getTMDbMovieList); // popular | top_rated | upcoming | now_playing
router.get("/tmdb/details/:tmdbId", getTMDbMovieDetails);
router.get("/tmdb/credits/:tmdbId", getTMDbMovieCredits);
router.get("/tmdb/recommendations/:tmdbId", getTMDbRecommendations);
router.get("/tmdb/release-dates/:tmdbId", getTMDbReleaseDates);

// ⭐ Local Review Routes
router.post("/tmdb/:tmdbId/reviews", authenticate, movieReview);
router.get("/tmdb/:tmdbId/reviews", getMovieReviews);
router.get("/tmdb/:tmdbId/rating", getMovieRating);
router.delete("/tmdb/reviews/delete", authenticate, deleteComment);

export default router;
