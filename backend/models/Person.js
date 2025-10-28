import mongoose from "mongoose";

const personSchema = new mongoose.Schema(
  {
    tmdbId: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    biography: { type: String },
    gender: { type: String },
    birthday: { type: String },
    placeOfBirth: { type: String },
    knownFor: [
      {
        type: { type: String, enum: ["movie", "tv"] },
        tmdbId: Number,
        title: String,
        posterPath: String,
        overview: String,
      },
    ],
    profilePath: { type: String },
    popularity: { type: Number },
  },
  { timestamps: true }
);

export default mongoose.model("Person", personSchema);
