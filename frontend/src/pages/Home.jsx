import { useEffect, useState, useMemo } from "react";
import { useGetTMDbMovieListQuery } from "../redux/api/movies";
import { useGetTMDbTVListQuery } from "../redux/api/tv";
import Loader from "../component/Loader";
import { Alert, Image } from "react-bootstrap";
import SliderUtil from "../component/SliderUtil";
import { motion } from "framer-motion";
import { defaultBackdrop } from "../assets";

const Home = () => {
  const {
    data: popularMovies,
    error: movieError,
    isLoading: movieLoading,
  } = useGetTMDbMovieListQuery("popular");

  const {
    data: popularTV,
    error: tvError,
    isLoading: tvLoading,
  } = useGetTMDbTVListQuery("popular");

  const movieResults = useMemo(() => popularMovies || [], [popularMovies]);
  const tvResults = useMemo(() => popularTV || [], [popularTV]);

  const [currentBackdrop, setCurrentBackdrop] = useState({});
  const [isMovieBackdrop, setIsMovieBackdrop] = useState(true);

  const getRandomItem = (array) => {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIsMovieBackdrop((prev) => !prev);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isMovieBackdrop && movieResults.length > 0) {
      setCurrentBackdrop(getRandomItem(movieResults));
    } else if (!isMovieBackdrop && tvResults.length > 0) {
      setCurrentBackdrop(getRandomItem(tvResults));
    }
  }, [isMovieBackdrop, movieResults, tvResults]);

  const hasError = movieError || tvError;
  const isLoading = movieLoading || tvLoading;

  return (
    <div className="w-full mx-auto 2xl:container pb-12" role="main">
      {hasError && (
        <Alert variant="danger" className="mt-4" role="alert">
          {movieError?.message || tvError?.message}
        </Alert>
      )}
      {isLoading && <Loader />}

      {!hasError && !isLoading && currentBackdrop?.backdrop_path && (
        <motion.div
          className="relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          aria-label="Featured Backdrop"
        >
          <Image
            src={
              currentBackdrop.backdrop_path
                ? `https://image.tmdb.org/t/p/w1280/${currentBackdrop.backdrop_path}`
                : defaultBackdrop
            }
            className="w-full max-h-[600px] object-cover"
            loading="lazy"
          />
          <div className="hidden md:block bg-black/30 p-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-3 text-white text-center">
            <div className="w-full">
              <h1 className="text-2xl font-semibold">
                {currentBackdrop.title || currentBackdrop.name}
              </h1>
              <p className="mt-4">
                {currentBackdrop.overview || "No description available."}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <motion.section
        className="px-8 lg:px-12 mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        aria-label="Popular Movies Section"
      >
        <h1 className="text-xl font-bold mb-4 text-white">Popular Movies</h1>
        <SliderUtil data={movieResults} />
      </motion.section>

      <div className="px-8 lg:px-12">
        <hr className="my-8 h-1 bg-gradient-to-r from-white via-gray-600 to-white rounded-full border-none" />
      </div>

      <motion.section
        className="px-8 lg:px-12 mt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        aria-label="Popular TV Shows Section"
      >
        <h1 className="text-xl font-bold mb-4 text-white">Popular TV Shows</h1>
        <SliderUtil data={tvResults} />
      </motion.section>
    </div>
  );
};

export default Home;
