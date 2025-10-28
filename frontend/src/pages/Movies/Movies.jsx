import { useState, useMemo, useEffect } from "react";
import { useGetTMDbMovieListQuery } from "../../redux/api/movies";
import { useGetMovieGenresQuery } from "../../redux/api/genre";
import MovieContainer from "../../component/MovieContainer";
import Sidebar from "../../component/Sidebar";
import { IoFilter } from "react-icons/io5";
import { Link } from "react-router";
import { motion } from "framer-motion";
import Loader from "../../component/Loader";

const getProductsPerPage = () => {
  const width = window.innerWidth;
  if (width >= 1280) return 10;
  if (width >= 1024) return 8;
  if (width >= 768) return 9;
  return 6;
};

const Movies = () => {
  const [selectedListTypes, setSelectedListTypes] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(getProductsPerPage());

  const nowPlaying = useGetTMDbMovieListQuery("now_playing");
  const popular = useGetTMDbMovieListQuery("popular");
  const topRated = useGetTMDbMovieListQuery("top_rated");
  const upcoming = useGetTMDbMovieListQuery("upcoming");
  const { data: genresData } = useGetMovieGenresQuery();

  const allMovies = useMemo(() => {
    const tag = (data, type) =>
      Array.isArray(data)
        ? data.map((movie) => ({ ...movie, listType: type }))
        : [];

    const combined = [
      ...tag(nowPlaying.data, "now_playing"),
      ...tag(popular.data, "popular"),
      ...tag(topRated.data, "top_rated"),
      ...tag(upcoming.data, "upcoming"),
    ];

    const uniqueMap = new Map();
    combined.forEach((movie) => {
      if (!uniqueMap.has(movie.id)) {
        uniqueMap.set(movie.id, movie);
      }
    });

    return Array.from(uniqueMap.values());
  }, [nowPlaying.data, popular.data, topRated.data, upcoming.data]);

  const isLoading =
    nowPlaying.isLoading ||
    popular.isLoading ||
    topRated.isLoading ||
    upcoming.isLoading;

  const filteredMovies = useMemo(() => {
    return allMovies.filter((movie) => {
      const matchesList =
        selectedListTypes.length === 0 ||
        selectedListTypes.includes(movie.listType);
      const matchesGenre =
        selectedGenres.length === 0 ||
        selectedGenres.some(
          (id) => Array.isArray(movie.genre_ids) && movie.genre_ids.includes(id)
        );
      return matchesList && matchesGenre;
    });
  }, [allMovies, selectedListTypes, selectedGenres]);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleResize = () => {
      setProductsPerPage(getProductsPerPage());
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className="w-full mx-auto 2xl:container"
      role="main"
      aria-label="Movies Page"
    >
      <div className="p-2 md:p-0 md:pr-8 lg:pr-12 flex items-start">
        {/* Mobile Sidebar */}
        <div>
          <Link
            className="md:hidden bg-cyan-700"
            onClick={() => setShowSidebar(true)}
          >
            <IoFilter />
          </Link>
          {showSidebar && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setShowSidebar(false)}
            >
              <div
                className="left-0 top-10 h-full w-64 bg-cyan-700 p-4 overflow-y-auto relative"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="absolute top-2 right-2 text-white text-xl font-bold"
                  onClick={() => setShowSidebar(false)}
                  aria-label="Close sidebar"
                >
                  &times;
                </button>
                <Sidebar
                  genres={genresData || []}
                  selectedListTypes={selectedListTypes}
                  setSelectedListTypes={setSelectedListTypes}
                  selectedGenres={selectedGenres}
                  setSelectedGenres={setSelectedGenres}
                  listTypes={[
                    "popular",
                    "top_rated",
                    "upcoming",
                    "now_playing",
                  ]}
                  mediaType="movies"
                />
              </div>
            </div>
          )}
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar
            genres={genresData || []}
            selectedListTypes={selectedListTypes}
            setSelectedListTypes={setSelectedListTypes}
            selectedGenres={selectedGenres}
            setSelectedGenres={setSelectedGenres}
            listTypes={["popular", "top_rated", "upcoming", "now_playing"]}
            mediaType="movies"
          />
        </div>

        {/* Movie Grid */}
        <div className="p-1 md:p-4 md:pr-0 flex-1">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            aria-label="Filtered Movie Results"
          >
            {isLoading ? (
              <div className="flex justify-center items-center h-screen w-full col-span-full">
                <Loader />
              </div>
            ) : filteredMovies.length > 0 ? (
              filteredMovies
                .slice(
                  (currentPage - 1) * productsPerPage,
                  currentPage * productsPerPage
                )
                .map((movie) => <MovieContainer key={movie.id} movie={movie} />)
            ) : (
              <p>No movies match your filters.</p>
            )}
          </motion.div>

          {/* Pagination */}
          <div
            className="flex justify-center items-center mt-3 gap-5 flex-wrap"
            aria-label="Pagination Controls"
          >
            {currentPage > 1 && (
              <motion.button
                className="pagination-button font-family-2"
                onClick={() => paginate(currentPage - 1)}
                whileTap={{ scale: 0.95 }}
              >
                Prev
              </motion.button>
            )}
            {Array(
              Math.min(3, Math.ceil(filteredMovies.length / productsPerPage))
            )
              .fill()
              .map((_, index) => {
                const pageNumber = Math.max(1, currentPage - 2) + index;
                return (
                  <motion.button
                    key={pageNumber}
                    className={`pagination-button font-family-2 ${
                      currentPage === pageNumber
                        ? "active bg-rose-900 text-white py-2 px-3 rounded-2xl"
                        : ""
                    }`}
                    onClick={() => paginate(pageNumber)}
                    whileTap={{ scale: 0.95 }}
                  >
                    {pageNumber}
                  </motion.button>
                );
              })}
            {currentPage <
              Math.ceil(filteredMovies.length / productsPerPage) && (
              <motion.button
                className="pagination-button font-family-2"
                onClick={() => paginate(currentPage + 1)}
                whileTap={{ scale: 0.95 }}
              >
                Next
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Movies;
