import express from "express";
import {
  addToFavorites,
  removeFromFavorites,
  getFavorites,
  addToWatchlist,
  removeFromWatchlist,
  getWatchlist,
} from "../controllers/accountController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ⭐ Favorites
router.post("/favorites", authenticate, addToFavorites);
router.delete("/favorites", authenticate, removeFromFavorites);
router.get("/favorites", authenticate, getFavorites);

// 📺 Watchlist
router.post("/watchlist", authenticate, addToWatchlist);
router.delete("/watchlist", authenticate, removeFromWatchlist);
router.get("/watchlist", authenticate, getWatchlist);

export default router;
