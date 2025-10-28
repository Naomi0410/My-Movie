// Packages
import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";

// Files
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import genreRoutes from "./routes/genreRoutes.js";
import moviesRoutes from "./routes/moviesRoutes.js";
import tvRoutes from "./routes/tvRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import accountRoutes from "./routes/accountRoutes.js";
import personRoutes from "./routes/personRoutes.js";

// Configuration
dotenv.config();
connectDB();

const app = express();

// CORS setup
app.use(cors({
  origin: "http://localhost:5173", // your frontend origin
  credentials: true,               // allow cookies to be sent
}));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/genre", genreRoutes);
app.use("/api/v1/movies", moviesRoutes);
app.use("/api/v1/tv", tvRoutes);
app.use("/api/v1/search", searchRoutes);
app.use("/api/v1/account", accountRoutes);
app.use("/api/v1/people", personRoutes);

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));
