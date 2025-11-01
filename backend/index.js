// ✅ Load and validate environment variables FIRST
import "./utils/validateEnv.js";

// Packages
import express from "express";
// import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";

// Files
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import genreRoutes from "./routes/genreRoutes.js";
import moviesRoutes from "./routes/moviesRoutes.js";
import tvRoutes from "./routes/tvRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import accountRoutes from "./routes/accountRoutes.js";
import personRoutes from "./routes/personRoutes.js";

// ✅ Connect to DB AFTER env is validated
connectDB();

const app = express();

app.get("/", (req, res) => {
  res.send("🎬 My-Movies API is running");
});

app.use(helmet());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://my-movie-five-lake.vercel.app"],
    credentials: false,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/genre", genreRoutes);
app.use("/api/v1/movies", moviesRoutes);
app.use("/api/v1/tv", tvRoutes);
app.use("/api/v1/search", searchRoutes);
app.use("/api/v1/account", accountRoutes);
app.use("/api/v1/people", personRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || res.statusCode || 500;
  res.status(status).json({ message: err.message || "Internal Server Error" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));
