import express from "express";
import {
  getPopularPeople,
  getPersonDetails,
  getPersonCredits,
} from "../controllers/personController.js";
import limitRequests from "../middlewares/rateLimit.js";

const router = express.Router();

// GET /api/v1/people — list of popular people
router.get("/", limitRequests, getPopularPeople);

// GET /api/v1/people/:id — detailed info about one person
router.get("/:id", limitRequests, getPersonDetails);

// GET /api/v1/people/:id/credits — movies and TV shows they’re known for
router.get("/:id/credits", limitRequests, getPersonCredits);

export default router;
