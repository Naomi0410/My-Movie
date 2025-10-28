import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB connected in ${process.env.NODE_ENV} mode`);
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
