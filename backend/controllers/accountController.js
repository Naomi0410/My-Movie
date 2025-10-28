import Account from "../models/Account.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import fetch from "node-fetch"; // or use axios


const TMDB_API_KEY = "1bc6fa4a28441fb34163e0d25bec8c20";
// 🧠 Helper: Get or create account for user
const getOrCreateAccount = async (userId) => {
  let account = await Account.findOne({ user: userId });
  if (!account) {
    account = new Account({ user: userId, favorites: [], watchlist: [] });
    await account.save();
  }
  return account;
};

// 🌐 Helper: Fetch TMDB details
const fetchTMDBDetails = async (tmdbId, mediaType) => {
  const url = `https://api.themoviedb.org/3/${mediaType}/${tmdbId}?api_key=${TMDB_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch TMDB details");
  return await res.json();
};

// ➕ Add to favorites
const addToFavorites = asyncHandler(async (req, res) => {
  const { tmdbId, mediaType } = req.body;
  if (!tmdbId || !mediaType) throw new Error("tmdbId and mediaType are required");

  const account = await getOrCreateAccount(req.user._id);
  const exists = account.favorites.find(
    (item) => item.tmdbId === tmdbId && item.mediaType === mediaType
  );
  if (exists) throw new Error("Already in favorites");

  const details = await fetchTMDBDetails(tmdbId, mediaType);

  account.favorites.push({
    tmdbId,
    mediaType,
    title: details.title || details.name,
    name: details.name,
    posterPath: details.poster_path,
    releaseDate: details.release_date || details.first_air_date,
    voteAverage: details.vote_average,
  });

  await account.save();
  res.status(200).json(account.favorites);
});

// ➖ Remove from favorites
const removeFromFavorites = asyncHandler(async (req, res) => {
  const { tmdbId, mediaType } = req.body;
  const account = await getOrCreateAccount(req.user._id);

  account.favorites = account.favorites.filter(
    (item) => !(item.tmdbId === tmdbId && item.mediaType === mediaType)
  );
  await account.save();
  res.status(200).json(account.favorites);
});

// ➕ Add to watchlist
const addToWatchlist = asyncHandler(async (req, res) => {
  const { tmdbId, mediaType } = req.body;
  if (!tmdbId || !mediaType) throw new Error("tmdbId and mediaType are required");

  const account = await getOrCreateAccount(req.user._id);
  const exists = account.watchlist.find(
    (item) => item.tmdbId === tmdbId && item.mediaType === mediaType
  );
  if (exists) throw new Error("Already in watchlist");

  const details = await fetchTMDBDetails(tmdbId, mediaType);

  account.watchlist.push({
    tmdbId,
    mediaType,
    title: details.title || details.name,
    name: details.name,
    posterPath: details.poster_path,
    releaseDate: details.release_date || details.first_air_date,
    voteAverage: details.vote_average,
  });

  await account.save();
  res.status(200).json(account.watchlist);
});

// ➖ Remove from watchlist
const removeFromWatchlist = asyncHandler(async (req, res) => {
  const { tmdbId, mediaType } = req.body;
  const account = await getOrCreateAccount(req.user._id);

  account.watchlist = account.watchlist.filter(
    (item) => !(item.tmdbId === tmdbId && item.mediaType === mediaType)
  );
  await account.save();
  res.status(200).json(account.watchlist);
});

// 📥 Get favorites
const getFavorites = asyncHandler(async (req, res) => {
  const account = await getOrCreateAccount(req.user._id);
  res.status(200).json(account.favorites);
});

// 📥 Get watchlist
const getWatchlist = asyncHandler(async (req, res) => {
  const account = await getOrCreateAccount(req.user._id);
  res.status(200).json(account.watchlist);
});

export {
  addToFavorites,
  removeFromFavorites,
  getFavorites,
  addToWatchlist,
  removeFromWatchlist,
  getWatchlist,
};
