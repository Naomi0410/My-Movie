import express from "express";
import {
  getPopularPeople,
  getPersonDetails,
  getPersonCredits,
} from "../controllers/personController.js";

const router = express.Router();

// GET /api/v1/people — list of popular people
router.get("/", getPopularPeople);

// GET /api/v1/people/:id — detailed info about one person
router.get("/:id", getPersonDetails);

// GET /api/v1/people/:id/credits — movies and TV shows they’re known for
router.get("/:id/credits", getPersonCredits);

export default router;
