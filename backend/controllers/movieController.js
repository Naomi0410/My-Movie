import Movie from "../models/Movie.js";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = process.env.TMDB_BASE_URL;

// 🔄 Utility: Fetch from TMDb
const fetchFromTMDb = async (endpoint) => {
  const response = await fetch(
    `${TMDB_BASE_URL}${endpoint}?api_key=${TMDB_API_KEY}&language=en-US`
  );
  const data = await response.json();
  return data;
};

// 📺 Utility: Fetch watch providers for a movie
const fetchWatchProviders = async (movieId) => {
  const response = await fetch(
    `${TMDB_BASE_URL}/movie/${movieId}/watch/providers?api_key=${TMDB_API_KEY}`
  );
  const data = await response.json();
  return data.results?.US?.flatrate?.map(p => p.provider_name) || [];
};

// 🌍 Get TMDb movie list (popular, top-rated, etc.)
const getTMDbMovieList = async (req, res) => {
  try {
    const { type } = req.params; 
    const totalPagesToFetch = 20; 
    const allMovies = [];

    for (let page = 1; page <= totalPagesToFetch; page++) {
      const response = await fetch(
        `${TMDB_BASE_URL}/movie/${type}?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`
      );
      const data = await response.json();

      const enrichedPage = await Promise.all(
        data.results.map(async (movie) => {
          const watchProviders = await fetchWatchProviders(movie.id);
          return { ...movie, watchProviders };
        })
      );

      allMovies.push(...enrichedPage);
    }

    res.json(allMovies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// 📄 Get TMDb movie details + local rating
const getTMDbMovieDetails = async (req, res) => {
  try {
    const { tmdbId } = req.params;
    const tmdbData = await fetchFromTMDb(`/movie/${tmdbId}`);
    const localMovie = await Movie.findOne({ tmdbId });

    const localRating = localMovie
      ? {
          rating: localMovie.rating,
          numReviews: localMovie.numReviews,
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

// 🎭 Get TMDb credits
const getTMDbMovieCredits = async (req, res) => {
  try {
    const { tmdbId } = req.params;
    const data = await fetchFromTMDb(`/movie/${tmdbId}/credits`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🧠 Get TMDb recommendations
const getTMDbRecommendations = async (req, res) => {
  try {
    const { tmdbId } = req.params;
    const data = await fetchFromTMDb(`/movie/${tmdbId}/recommendations`);
    res.json(data.results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🧾 Get TMDb release dates
const getTMDbReleaseDates = async (req, res) => {
  try {
    const { tmdbId } = req.params;
    const data = await fetchFromTMDb(`/movie/${tmdbId}/release_dates`);
    res.json(data.results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ⭐ Add a review (linked to TMDb movie ID)
const movieReview = async (req, res) => {
  try {
    const { tmdbId } = req.params;
    const { rating, comment } = req.body;

    let movie = await Movie.findOne({ tmdbId });
    if (!movie) {
      movie = new Movie({ tmdbId, reviews: [] });
    }

    const alreadyReviewed = movie.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) throw new Error("Movie already reviewed");

    const review = {
      name: req.user.username,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    movie.reviews.push(review);
    movie.numReviews = movie.reviews.length;
    movie.rating =
      movie.reviews.reduce((acc, item) => item.rating + acc, 0) /
      movie.reviews.length;

    await movie.save();
    res.status(201).json({ message: "Review Added" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 🗑️ Delete a review
const deleteComment = async (req, res) => {
  try {
    const { tmdbId, reviewId } = req.body;
    const movie = await Movie.findOne({ tmdbId });
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    const reviewIndex = movie.reviews.findIndex(
      (r) => r._id.toString() === reviewId
    );
    if (reviewIndex === -1)
      return res.status(404).json({ message: "Comment not found" });

    movie.reviews.splice(reviewIndex, 1);
    movie.numReviews = movie.reviews.length;
    movie.rating =
      movie.reviews.length > 0
        ? movie.reviews.reduce((acc, item) => item.rating + acc, 0) /
          movie.reviews.length
        : 0;

    await movie.save();
    res.json({ message: "Comment Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🗂️ Get reviews for a TMDb movie
const getMovieReviews = async (req, res) => {
  try {
    const { tmdbId } = req.params;
    const movie = await Movie.findOne({ tmdbId });
    if (!movie) return res.json([]);
    res.json(movie.reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📊 Get local rating summary
const getMovieRating = async (req, res) => {
  try {
    const { tmdbId } = req.params;
    const movie = await Movie.findOne({ tmdbId });
    if (!movie) return res.json({ rating: 0, numReviews: 0 });
    res.json({ rating: movie.rating, numReviews: movie.numReviews });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  getTMDbMovieList,
  getTMDbMovieDetails,
  getTMDbMovieCredits,
  getTMDbRecommendations,
  getTMDbReleaseDates,
  movieReview,
  deleteComment,
  getMovieReviews,
  getMovieRating,
};
