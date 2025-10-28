import express from "express";
import {
  getTMDbMovieGenres,
  getTMDbTVGenres,
} from "../controllers/genreController.js";

const router = express.Router();

router.get("/movie", getTMDbMovieGenres); // GET /api/v1/genre/movie
router.get("/tv", getTMDbTVGenres);       // GET /api/v1/genre/tv

export default router;
