import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const reviewSchema = new mongoose.Schema(
  {
    user: { type: ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const castSchema = new mongoose.Schema({
  name: String,
  character: String,
  profilePath: String,
});

const crewSchema = new mongoose.Schema({
  name: String,
  job: String,
  department: String,
});

const imageSchema = new mongoose.Schema({
  filePath: String,
  type: { type: String }, // poster, backdrop, etc.
});

const tvSchema = new mongoose.Schema(
  {
    tmdbId: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    overview: { type: String },
    genres: [{ type: String }],
    firstAirDate: { type: String },
    lastAirDate: { type: String },
    numberOfSeasons: { type: Number },
    numberOfEpisodes: { type: Number },
    status: { type: String }, // e.g., "Returning Series"
    popularity: { type: Number },
    voteAverage: { type: Number }, // TMDb rating
    voteCount: { type: Number },
    rating: { type: Number, default: 0 }, // Local average rating
    numReviews: { type: Number, default: 0 },
    originalLanguage: { type: String },
    posterPath: { type: String },
    backdropPath: { type: String },
    keywords: [{ type: String }],
    cast: [castSchema],
    crew: [crewSchema],
    images: [imageSchema],
    recommendations: [{ type: Number }], // TMDb IDs of recommended shows
    reviews: [reviewSchema],
    watchProviders: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
    listType: {
      type: String,
      enum: ["popular", "top_rated", "airing_today", "on_the_air"],
    },
  },
  { timestamps: true }
);

const TV = mongoose.model("TV", tvSchema);
export default TV;
