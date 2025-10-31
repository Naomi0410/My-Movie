import Genre from "../models/Genre.js";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = process.env.TMDB_BASE_URL;;

// 🔄 Utility: Fetch from TMDb
const fetchFromTMDb = async (endpoint) => {
  const response = await fetch(
    `${TMDB_BASE_URL}${endpoint}?api_key=${TMDB_API_KEY}&language=en-US`
  );
  const data = await response.json();
  return data;
};

// 🎬 Get TMDb Movie Genres
const getTMDbMovieGenres = async (req, res) => {
  try {
    const data = await fetchFromTMDb("/genre/movie/list");
    res.json(data.genres);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📺 Get TMDb TV Genres
const getTMDbTVGenres = async (req, res) => {
  try {
    const data = await fetchFromTMDb("/genre/tv/list");
    res.json(data.genres);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



export {
  getTMDbMovieGenres,
  getTMDbTVGenres,
};
