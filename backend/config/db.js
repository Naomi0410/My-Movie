import mongoose from "mongoose";
import env from "../utils/validateEnv.js";

const DEFAULT_RETRY = 5;
const RETRY_DELAY_MS = 2000;

const wait = (ms) => new Promise((res) => setTimeout(res, ms));

const connectDB = async (retries = DEFAULT_RETRY) => {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log(`✅ MongoDB connected in ${env.NODE_ENV} mode`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    if (retries > 0) {
      console.log(
        `↻ Retry connecting to MongoDB in ${RETRY_DELAY_MS}ms (${retries} retries left)`
      );
      await wait(RETRY_DELAY_MS);
      return connectDB(retries - 1);
    }
    process.exit(1);
  }

  // Graceful shutdown on app termination
  const gracefulClose = async (signal) => {
    try {
      await mongoose.connection.close();
      console.log(`🔌 MongoDB connection closed due to ${signal || "app termination"}`);
      process.exit(0);
    } catch (err) {
      console.error("Error closing MongoDB connection:", err);
      process.exit(1);
    }
  };
  process.on("SIGINT", () => gracefulClose("SIGINT"));
  process.on("SIGTERM", () => gracefulClose("SIGTERM"));
};

export default connectDB;
