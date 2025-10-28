import mongoose from "mongoose";

const genreSchema = new mongoose.Schema(
  {
    tmdbId: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      trim: true,
      required: true,
      maxLength: 64,
      unique: true,
    },
    type: {
      type: String,
      enum: ["movie", "tv"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Genre", genreSchema);
