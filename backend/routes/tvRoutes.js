import express from "express";
const router = express.Router();

// Controllers
import {
  getTMDbTVList,
  getTMDbTVDetails,
  getTMDbTVCredits,
  getTMDbTVRecommendations,
  getTMDbTVContentRatings,
  tvReview,
  deleteTVComment,
  getTVReviews,
  getTVRating,
} from "../controllers/tvController.js";

// Middlewares
import { authenticate } from "../middlewares/authMiddleware.js";

// 🌍 TMDb Public Routes
router.get("/tmdb/list/:type", getTMDbTVList); // popular | top_rated | airing_today | on_the_air
router.get("/tmdb/details/:tmdbId", getTMDbTVDetails);
router.get("/tmdb/credits/:tmdbId", getTMDbTVCredits);
router.get("/tmdb/recommendations/:tmdbId", getTMDbTVRecommendations);
router.get("/tmdb/content-ratings/:tmdbId", getTMDbTVContentRatings);

// ⭐ Local Review Routes
router.post("/tmdb/:tmdbId/reviews", authenticate, tvReview);
router.get("/tmdb/:tmdbId/reviews", getTVReviews);
router.get("/tmdb/:tmdbId/rating", getTVRating);
router.delete("/tmdb/reviews/delete", authenticate, deleteTVComment);

export default router;
