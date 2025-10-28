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

const movieSchema = new mongoose.Schema(
  {
    tmdbId: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    overview: { type: String },
    genres: [{ type: String }],
    releaseDate: { type: String },
    certification: { type: String },
    runtime: { type: Number },
    popularity: { type: Number },
    voteAverage: { type: Number }, // TMDb rating
    voteCount: { type: Number }, // TMDb vote count
    rating: { type: Number, default: 0 }, // Local average rating
    originalLanguage: { type: String },
    posterPath: { type: String },
    backdropPath: { type: String },
     homepage: { type: String },
    keywords: [{ type: String }],
    cast: [castSchema],
    crew: [crewSchema],
    images: [imageSchema],
    recommendations: [{ type: Number }], // TMDb IDs of recommended movies
    reviews: [reviewSchema],
    numReviews: { type: Number, default: 0 },
    watchProviders: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
    listType: {
      type: String,
      enum: ["popular", "top_rated", "upcoming", "now_playing"],
    },
  },
  { timestamps: true }
);

const Movie = mongoose.model("Movie", movieSchema);
export default Movie;
