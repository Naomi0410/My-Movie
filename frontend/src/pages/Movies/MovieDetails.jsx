import { Alert } from "react-bootstrap";
import {
  useGetTMDbMovieDetailsQuery,
  useGetTMDbRecommendationsQuery,
} from "../../redux/api/movies";
import { useParams } from "react-router-dom";
import Loader from "../../component/Loader";
import { FaStar, FaRegStar } from "react-icons/fa";
import { useMemo } from "react";
import SliderUtil from "../../component/SliderUtil";
import MovieCast from "../../component/MovieCast";
import { motion } from "framer-motion";
import { useLayoutEffect } from "react";

const MovieDetails = () => {
  const { id } = useParams();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  const { data, error, isLoading } = useGetTMDbMovieDetailsQuery(id);
  const { data: recommendation } = useGetTMDbRecommendationsQuery(id);

  // Convert RTK Query error object to a safe string for rendering
  const errorMessage = useMemo(() => {
    if (!error) return null;
    if (typeof error === "string") return error;
    if (error?.data) {
      if (typeof error.data === "string") return error.data;
      if (error.data?.message) return error.data.message;
      try {
        return JSON.stringify(error.data);
      } catch {
        return String(error.data);
      }
    }
    return error?.error || JSON.stringify(error);
  }, [error]);

  const results = useMemo(() => recommendation || [], [recommendation]);

  const renderStars = (rating) => {
    const stars = Math.round(rating / 2);
    return (
      <div
        className="flex gap-1 text-cyan-400"
        aria-label={`Rated ${rating} out of 10`}
      >
        {[...Array(5)].map((_, i) =>
          i < stars ? <FaStar key={i} /> : <FaRegStar key={i} />
        )}
      </div>
    );
  };

  return (
    <div
      className="w-full mx-auto 2xl:container pb-12"
      role="main"
      aria-label="Movie Details Page"
    >
      {errorMessage && (
        <Alert variant="danger" className="mt-4" role="alert">
          {errorMessage}
        </Alert>
      )}
      {isLoading && (
        <div className="flex justify-center items-center h-[screen] w-full">
          <Loader />
        </div>
      )}
      {!error && !isLoading && data && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          role="region"
          aria-label={`Details for ${data.title}`}
        >
          <div className="relative">
            <img
              src={`https://image.tmdb.org/t/p/w1280/${data.backdrop_path}`}
              alt={`Backdrop of ${data.title}`}
              loading="lazy"
              className="w-full min-h-[600px] object-cover filter brightness-50"
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-5">
              <div className="flex justify-center gap-8 items-center text-white">
                <div className="w-full md:w-[30%]">
                  <img
                    src={`https://image.tmdb.org/t/p/w500/${data.poster_path}`}
                    alt={`Poster of ${data.title}`}
                    loading="lazy"
                    className="w-full h-[400px] md:w-[400px] md:h-[300px] lg:h-[500px] rounded-lg shadow-sm"
                  />
                  <div className="lg:hidden mt-4 text-center">
                    <h2 className="text-xl">{data.title}</h2>
                  </div>
                </div>
                <div className="hidden md:block md:w-[45%] bg-black/50 p-5 rounded-lg">
                  <h2 className="text-xl font-bold mb-3">{data.title}</h2>
                  <h3 className="text-base font-semibold">PLOT</h3>
                  <p className="font-light text-sm">{data.overview}</p>
                  <div className="mt-5 flex justify-between items-center">
                    <div>
                      <h3 className="text-base font-semibold">RELEASED</h3>
                      <p className="text-sm">{data.release_date}</p>
                    </div>
                    <div>
                      <h3 className="text-base font-semibold">RATING</h3>
                      <div className="flex items-center gap-2">
                        {renderStars(data.vote_average)}
                        <span className="text-sm">
                          {data.vote_average.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-base font-semibold">RUNTIME</h3>
                      <p className="text-sm">{data.runtime} minutes</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <h3 className="text-base font-semibold">GENRE</h3>
                    <div className="flex flex-wrap gap-2">
                      {data.genres.map((genre) => (
                        <span
                          key={genre.id}
                          className="text-sm bg-cyan-500 rounded-lg py-1 px-2 text-black font-bold"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                    <div className="mt-3 flex justify-between items-center">
                      <div>
                        <h3 className="text-base font-semibold">BUDGET</h3>
                        <p className="text-sm">
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                          }).format(data.budget)}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-base font-semibold">REVENUE</h3>
                        <p className="text-sm">
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                          }).format(data.revenue)}
                        </p>
                      </div>
                    </div>
                    {data.homepage && (
                      <div className="mt-4">
                        <a
                          href={data.homepage}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Visit homepage for ${data.title}`}
                          className="bg-cyan-500 font-bold text-white px-3 py-1 rounded-lg hover:bg-cyan-600 transition"
                        >
                          Watch Now
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile View */}
          <section
            className="md:hidden my-4 p-4"
            aria-label="Mobile Movie Details"
          >
            <h3 className="text-base font-semibold mt-3">PLOT</h3>
            <p className="text-sm font-light">{data.overview}</p>
            <div className="mt-5 flex flex-wrap justify-between items-center">
              <div>
                <h3 className="text-base font-semibold">RELEASED</h3>
                <p className="text-xs">{data.release_date}</p>
              </div>
              <div>
                <h3 className="text-base font-semibold">RATING</h3>
                <div className="flex items-center gap-2">
                  {renderStars(data.vote_average)}
                  <span className="text-xs">
                    {data.vote_average.toFixed(1)}
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-base font-semibold">RUNTIME</h3>
                <p className="text-xs">{data.runtime} minutes</p>
              </div>
            </div>
            <div className="mt-3 mb-4">
              <h3 className="text-base font-semibold">GENRE</h3>
              <div className="flex flex-wrap gap-2">
                {data.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="text-sm bg-cyan-500 rounded-lg py-1 px-2 text-black font-bold"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
              <div className="mt-3 flex justify-between items-center">
                <div>
                  <h3 className="text-base font-semibold">BUDGET</h3>
                  <p className="text-xs">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(data.budget)}
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold">REVENUE</h3>
                  <p className="text-xs">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(data.revenue)}
                  </p>
                </div>
              </div>
              {data.homepage && (
                <div className="mt-4">
                  <a
                    href={data.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit homepage for ${data.title}`}
                    className="bg-cyan-500 font-bold text-white px-3 py-1 rounded-lg hover:bg-cyan-600 transition"
                  >
                    Watch Now
                  </a>
                </div>
              )}
            </div>
          </section>

          {/* Cast Section */}
          <section aria-label="Movie Cast">
            <MovieCast />
          </section>

          {/* Divider */}
          <div className="px-8 lg:px-12">
            <hr className="my-8 h-1 bg-gradient-to-r from-white via-gray-600 to-white rounded-full border-none" />
          </div>

          {/* Recommendations Section */}
          <section
            className="px-8 py-6 lg:px-12 mt-8"
            aria-label="Recommended Movies"
          >
            <h1 className="text-xl font-bold mb-4 text-white">
              Recommendations
            </h1>
            <SliderUtil data={results} />
          </section>
        </motion.div>
      )}
    </div>
  );
};

export default MovieDetails;
