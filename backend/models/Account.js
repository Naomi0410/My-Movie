import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    favorites: [
      {
        tmdbId: Number,
        mediaType: String,
        title: String,
        name: String,
        posterPath: String,
        releaseDate: String,
        voteAverage: Number,
        addedAt: { type: Date, default: Date.now },
      },
    ],

    watchlist: [
      {
        tmdbId: Number,
        mediaType: String,
        title: String,
        name: String,
        posterPath: String,
        releaseDate: String,
        voteAverage: Number,
        addedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Account = mongoose.model("Account", accountSchema);
export default Account;
