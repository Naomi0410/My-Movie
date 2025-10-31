import mongoose from "mongoose";
import env from "../utils/validateEnv.js";

const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB connected in ${env.NODE_ENV} mode`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }

  // Optional: Graceful shutdown on app termination
  process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("🔌 MongoDB connection closed due to app termination");
    process.exit(0);
  });
};

export default connectDB;
