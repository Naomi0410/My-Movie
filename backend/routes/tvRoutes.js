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
import limitRequests from "../middlewares/rateLimit.js";

// 🌍 TMDb Public Routes (rate-limited)
router.get("/tmdb/list/:type", limitRequests, getTMDbTVList); // popular | top_rated | airing_today | on_the_air
router.get("/tmdb/details/:tmdbId", limitRequests, getTMDbTVDetails);
router.get("/tmdb/credits/:tmdbId", limitRequests, getTMDbTVCredits);
router.get("/tmdb/recommendations/:tmdbId", limitRequests, getTMDbTVRecommendations);
router.get("/tmdb/content-ratings/:tmdbId", limitRequests, getTMDbTVContentRatings);

// ⭐ Local Review Routes (rate-limited + auth where needed)
router.post("/tmdb/:tmdbId/reviews", limitRequests, authenticate, tvReview);
router.get("/tmdb/:tmdbId/reviews", limitRequests, getTVReviews);
router.get("/tmdb/:tmdbId/rating", limitRequests, getTVRating);
router.delete("/tmdb/reviews/delete", limitRequests, authenticate, deleteTVComment);

export default router;
