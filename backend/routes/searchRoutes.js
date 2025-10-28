import express from "express";
const router = express.Router();
import { searchTMDb } from "../controllers/searchController.js";

router.get("/tmdb", searchTMDb); // /api/search/tmdb?query=breaking&type=tv

export default router;
