const TMDB_API_KEY = "1bc6fa4a28441fb34163e0d25bec8c20";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const searchTMDb = async (req, res) => {
  try {
    const { query, type } = req.query; // type = movie | tv | person | multi
    if (!query || !type) {
      return res.status(400).json({ error: "Missing query or type" });
    }

    const response = await fetch(
      `${TMDB_BASE_URL}/search/${type}?api_key=${TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(query)}`
    );
    const data = await response.json();
    res.json(data.results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { searchTMDb };
