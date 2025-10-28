import { Link } from "react-router";
import { motion } from "framer-motion";

const Sidebar = ({
  genres,
  selectedListTypes,
  setSelectedListTypes,
  selectedGenres,
  setSelectedGenres,
  listTypes,
  mediaType = "movies",
}) => {
  const toggleSelection = (value, selected, setSelected) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleResetFilters = () => {
    setSelectedListTypes([]);
    setSelectedGenres([]);
  };

  const headingLabel = mediaType === "tv" ? "Filter TV Shows" : "Filter Movies";

  return (
    <motion.aside
      role="complementary"
      aria-label={`${headingLabel} Sidebar`}
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="md:h-[80vh] lg:h-[90vh] md:w-48 lg:w-64 p-2 md:p-4 bg-cyan-700"
    >
      <h2 className="text-lg lg:text-xl font-bold mb-4">{headingLabel}</h2>

      {/* List Type Checkboxes */}
      <fieldset className="mb-3" aria-label="List Type Filters">
        <legend className="block text-base lg:text-lg font-semibold mb-2">List Type</legend>
        {listTypes.map((type) => (
          <div key={type} className="flex text-sm lg:text-base items-center mb-1">
            <input
              type="checkbox"
              id={`list-${type}`}
              checked={selectedListTypes.includes(type)}
              onChange={() =>
                toggleSelection(type, selectedListTypes, setSelectedListTypes)
              }
            />
            <label htmlFor={`list-${type}`} className="ml-2 capitalize">
              {type.replace("_", " ")}
            </label>
          </div>
        ))}
      </fieldset>

      {/* Genre Checkboxes */}
      <fieldset className="mb-6" aria-label="Genre Filters">
        <legend className="block text-base lg:text-lg font-semibold mb-2">Genres</legend>
        <div className="flex gap-2 flex-wrap">
          {genres.length === 0 ? (
            <p className="text-sm text-gray-500">No genres available</p>
          ) : (
            genres.map((genre) => (
              <motion.button
                key={genre.id}
                className={`text-xs lg:text-sm bg-white rounded-xl text-black hover:bg-gray-300 py-1 px-2 ${
                  selectedGenres.includes(genre.id) ? "!bg-black text-white" : ""
                }`}
                onClick={() =>
                  toggleSelection(genre.id, selectedGenres, setSelectedGenres)
                }
                aria-pressed={selectedGenres.includes(genre.id)}
                whileTap={{ scale: 0.95 }}
              >
                {genre.name}
              </motion.button>
            ))
          )}
        </div>
      </fieldset>

      {/* Reset Button */}
      <motion.button
        onClick={handleResetFilters}
        className="w-full bg-rose-800 text-white py-2 rounded hover:bg-rose-900 transition-colors"
        aria-label="Reset all filters"
        whileTap={{ scale: 0.95 }}
      >
        Reset Filters
      </motion.button>
    </motion.aside>
  );
};

export default Sidebar;
