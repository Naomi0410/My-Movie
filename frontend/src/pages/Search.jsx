import { useState } from "react";
import { useSearchTMDbQuery } from "../redux/api/search";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Loader from "../component/Loader";

const Search = () => {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("movie");

  const { data, error, isLoading } = useSearchTMDbQuery(
    { query, type },
    {
      skip: query.length < 2,
    }
  );

  return (
    <div
      className="w-full mx-auto 2xl:container pt-8 px-3 md:px-8 lg:px-12"
      role="main"
      aria-label="Search Page"
    >
      <h1 className="text-xl font-bold mb-4  text-white">Search</h1>
      <div className="flex gap-2 mb-2" role="search">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for movies, TV shows, or people..."
          className="px-2 md:px-4 py-2 text-sm rounded-lg w-full bg-slate-700 text-white"
          aria-label="Search input"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="py-2 text-base rounded-lg text-black bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          aria-label="Select media type"
        >
          <option value="movie">Movie</option>
          <option value="tv">TV</option>
          <option value="person">Person</option>
        </select>
      </div>

      {query.length === 0 ? (
        <p className="text-white text-xs md:text-sm">
          Start typing to search...
        </p>
      ) : isLoading ? (
        <div className="flex justify-center items-center h-[200px]">
          <Loader />
        </div>
      ) : error ? (
        <p className="text-red-500">Error fetching results</p>
      ) : data?.length > 0 ? (
        <div
          className="mt-8 pb-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
          aria-label="Search Results"
        >
          {data.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: false, amount: 0.2 }}
            >
              <Link
                to={`/${type === "person" ? "people" : type}/${item.id}`}
                className="text-white text-center block"
                aria-label={`View details for ${item.title || item.name}`}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w200${
                    item.poster_path || item.profile_path
                  }`}
                  alt={`Poster of ${item.title || item.name}`}
                  loading="lazy"
                  className="rounded-lg mx-auto mb-2 w-full h-[200px] md:h-[300px] object-cover"
                />
                <p className="font-semibold text-sm">
                  {item.title || item.name}
                </p>
                {item.character && (
                  <p className="text-xs text-gray-300">as {item.character}</p>
                )}
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-white">
          No results found for <span className="font-bold">"{query}"</span>.
        </p>
      )}
    </div>
  );
};

export default Search;
