import Person from "../models/Person.js";

const TMDB_API_KEY = "1bc6fa4a28441fb34163e0d25bec8c20";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const getPopularPeople = async (req, res) => {
  const totalPagesToFetch = 10; // You can increase this if needed
  const allPeople = [];

  try {
    for (let page = 1; page <= totalPagesToFetch; page++) {
      const response = await fetch(
        `${TMDB_BASE_URL}/person/popular?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`
      );
      const data = await response.json();
      allPeople.push(...data.results);
    }

    res.json(allPeople); // Send full array to frontend
  } catch (error) {
    res.status(500).json({ message: "Error fetching popular people" });
  }
};



const getPersonDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/person/${id}?api_key=${TMDB_API_KEY}&language=en-US&append_to_response=movie_credits,tv_credits`
    );
    const data = await response.json();
    res.json(data); // includes biography, personal info, known-for titles
  } catch (error) {
    res.status(500).json({ message: "Error fetching person details" });
  }
};

const getPersonCredits = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/person/${id}/combined_credits?api_key=${TMDB_API_KEY}&language=en-US`
    );
    const data = await response.json();

    const knownFor = data.cast.map((item) => ({
      tmdbId: item.id,
      title: item.title || item.name,
      type: item.media_type, // "movie" or "tv"
      posterPath: item.poster_path,
      overview: item.overview,
      character: item.character,
    }));

    res.json(knownFor);
  } catch (error) {
    res.status(500).json({ message: "Error fetching person credits" });
  }
};

export { getPersonCredits, getPersonDetails, getPopularPeople };
