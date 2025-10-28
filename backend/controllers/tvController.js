import TV from "../models/TV.js";

const TMDB_API_KEY = "1bc6fa4a28441fb34163e0d25bec8c20";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// 🔄 Utility: Fetch from TMDb
const fetchFromTMDb = async (endpoint) => {
  const response = await fetch(
    `${TMDB_BASE_URL}${endpoint}?api_key=${TMDB_API_KEY}&language=en-US`
  );
  const data = await response.json();
  return data;
};

// 🌍 Get TMDb TV list
const getTMDbTVList = async (req, res) => {
  try {
    const { type } = req.params; // e.g. "popular", "top_rated", "airing_today", "on_the_air"
    const totalPagesToFetch = 20; // You can increase this if needed
    const allTVShows = [];

    for (let page = 1; page <= totalPagesToFetch; page++) {
      const response = await fetch(
        `${TMDB_BASE_URL}/tv/${type}?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`
      );
      const data = await response.json();
      allTVShows.push(...data.results);
    }

    res.json(allTVShows); // Send full array to frontend
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📄 Get TMDb TV details + local rating
const getTMDbTVDetails = async (req, res) => {
  try {
    const { tmdbId } = req.params;
    const tmdbData = await fetchFromTMDb(`/tv/${tmdbId}`);
    const localTV = await TV.findOne({ tmdbId });

    const localRating = localTV
      ? {
          rating: localTV.rating,
          numReviews: localTV.numReviews,
        }
      : {
          rating: 0,
          numReviews: 0,
        };

    res.json({ ...tmdbData, localRating });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🎭 Get TMDb TV credits
const getTMDbTVCredits = async (req, res) => {
  try {
    const { tmdbId } = req.params;
    const data = await fetchFromTMDb(`/tv/${tmdbId}/credits`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🧠 Get TMDb TV recommendations
const getTMDbTVRecommendations = async (req, res) => {
  try {
    const { tmdbId } = req.params;
    const data = await fetchFromTMDb(`/tv/${tmdbId}/recommendations`);
    res.json(data.results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🧾 Get TMDb TV content ratings
const getTMDbTVContentRatings = async (req, res) => {
  try {
    const { tmdbId } = req.params;
    const data = await fetchFromTMDb(`/tv/${tmdbId}/content_ratings`);
    res.json(data.results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ⭐ Add a review (linked to TMDb TV ID)
const tvReview = async (req, res) => {
  try {
    const { tmdbId } = req.params;
    const { rating, comment } = req.body;

    let tv = await TV.findOne({ tmdbId });
    if (!tv) {
      tv = new TV({ tmdbId, reviews: [] });
    }

    const alreadyReviewed = tv.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) throw new Error("TV show already reviewed");

    const review = {
      name: req.user.username,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    tv.reviews.push(review);
    tv.numReviews = tv.reviews.length;
    tv.rating =
      tv.reviews.reduce((acc, item) => item.rating + acc, 0) /
      tv.reviews.length;

    await tv.save();
    res.status(201).json({ message: "Review Added" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 🗑️ Delete a review
const deleteTVComment = async (req, res) => {
  try {
    const { tmdbId, reviewId } = req.body;
    const tv = await TV.findOne({ tmdbId });
    if (!tv) return res.status(404).json({ message: "TV show not found" });

    const reviewIndex = tv.reviews.findIndex(
      (r) => r._id.toString() === reviewId
    );
    if (reviewIndex === -1)
      return res.status(404).json({ message: "Comment not found" });

    tv.reviews.splice(reviewIndex, 1);
    tv.numReviews = tv.reviews.length;
    tv.rating =
      tv.reviews.length > 0
        ? tv.reviews.reduce((acc, item) => item.rating + acc, 0) /
          tv.reviews.length
        : 0;

    await tv.save();
    res.json({ message: "Comment Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🗂️ Get reviews for a TV show
const getTVReviews = async (req, res) => {
  try {
    const { tmdbId } = req.params;
    const tv = await TV.findOne({ tmdbId });
    if (!tv) return res.json([]);
    res.json(tv.reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📊 Get local rating summary
const getTVRating = async (req, res) => {
  try {
    const { tmdbId } = req.params;
    const tv = await TV.findOne({ tmdbId });
    if (!tv) return res.json({ rating: 0, numReviews: 0 });
    res.json({ rating: tv.rating, numReviews: tv.numReviews });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  getTMDbTVList,
  getTMDbTVDetails,
  getTMDbTVCredits,
  getTMDbTVRecommendations,
  getTMDbTVContentRatings,
  tvReview,
  deleteTVComment,
  getTVReviews,
  getTVRating,
};
