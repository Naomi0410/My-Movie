import { useState } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark } from "react-icons/fa";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useAddToFavoritesMutation,
  useRemoveFromFavoritesMutation,
  useGetFavoritesQuery,
  useAddToWatchlistMutation,
  useRemoveFromWatchlistMutation,
  useGetWatchlistQuery,
} from "../redux/api/account";
import ModalView from "./ModalView";
import { motion } from "framer-motion";

const MovieContainer = ({ movie }) => {
  const { poster_path, id, title, release_date, vote_average } = movie;
  const { userInfo } = useSelector((state) => state.auth);

  const [favLoading, setFavLoading] = useState(false);
  const [watchLoading, setWatchLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { data: favorites = [], refetch: refetchFavorites } = useGetFavoritesQuery();
  const { data: watchlist = [], refetch: refetchWatchlist } = useGetWatchlistQuery();

  const [addToFavorites] = useAddToFavoritesMutation();
  const [removeFromFavorites] = useRemoveFromFavoritesMutation();
  const [addToWatchlist] = useAddToWatchlistMutation();
  const [removeFromWatchlist] = useRemoveFromWatchlistMutation();

  const isFavorite = favorites.some(item => item.tmdbId === id && item.mediaType === "movie");
  const isWatchlisted = watchlist.some(item => item.tmdbId === id && item.mediaType === "movie");

  const truncateTitle = (text, maxLength = 15) =>
    text.length > maxLength ? text.slice(0, maxLength) + "..." : text;

  const formatDate = (dateStr) => {
    if (!dateStr) return "Unknown";
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const renderStars = (rating) => {
    const stars = Math.round(rating / 2);
    return (
      <div className="rating rating-xs" aria-label={`Rated ${rating} out of 10`}>
        {[...Array(5)].map((_, i) => (
          <input
            key={i}
            type="radio"
            name={`rating-${id}`}
            className="mask mask-star-2 bg-rose-400"
            checked={i < stars}
            readOnly
          />
        ))}
      </div>
    );
  };

  const getRoundedRating = (rating) => {
    const width = window.innerWidth;
    return width < 768 ? Math.round(rating) : rating;
  };

  const handleToggleFavorite = async () => {
    if (!userInfo) {
      setShowModal(true);
      return;
    }
    setFavLoading(true);
    try {
      if (isFavorite) {
        await removeFromFavorites({ tmdbId: id, mediaType: "movie" }).unwrap();
        toast.info("Removed from favorites");
      } else {
        await addToFavorites({ tmdbId: id, mediaType: "movie" }).unwrap();
        toast.success("Added to favorites");
      }
      await refetchFavorites();
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "Favorite action failed");
    } finally {
      setFavLoading(false);
    }
  };

  const handleToggleWatchlist = async () => {
    if (!userInfo) {
      setShowModal(true);
      return;
    }
    setWatchLoading(true);
    try {
      if (isWatchlisted) {
        await removeFromWatchlist({ tmdbId: id, mediaType: "movie" }).unwrap();
        toast.info("Removed from watchlist");
      } else {
        await addToWatchlist({ tmdbId: id, mediaType: "movie" }).unwrap();
        toast.success("Added to watchlist");
      }
      await refetchWatchlist();
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "Watchlist action failed");
    } finally {
      setWatchLoading(false);
    }
  };

  return (
    <>
      <motion.div
        role="article"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        layout
        className="card shadow-sm bg-white text-black font-semibold relative"
        aria-label={`Movie card for ${title}`}
      >
        <Link to={`/movie/${id}`} aria-label={`View details for ${title}`}>
          <figure>
            <img
              src={`https://image.tmdb.org/t/p/w200${poster_path}`}
              alt={`Poster of ${title}`}
              className="rounded-sm shadow-sm object-center w-full border-b-2 border-black h-[150px] md:h-[180px] lg:h-[200px] max-w-xs mx-auto hover:opacity-80 transition-opacity duration-300"
            />
          </figure>
        </Link>

        <div className="absolute top-2 right-2 flex flex-col gap-2">
          <motion.button
            onClick={handleToggleFavorite}
            disabled={favLoading}
            className={`bg-black/60 text-white p-2 rounded-full ${
              isFavorite ? "!text-red-500" : "hover:text-red-600"
            }`}
            title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            aria-label={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            whileTap={{ scale: 0.9 }}
          >
            {isFavorite ? <FaHeart size={16} /> : <FaRegHeart size={16} />}
          </motion.button>
          <motion.button
            onClick={handleToggleWatchlist}
            disabled={watchLoading}
            className={`bg-black/60 text-white p-2 rounded-full ${
              isWatchlisted ? "text-yellow-400" : "hover:text-yellow-500"
            }`}
            title={isWatchlisted ? "Remove from Watchlist" : "Add to Watchlist"}
            aria-label={isWatchlisted ? "Remove from Watchlist" : "Add to Watchlist"}
            whileTap={{ scale: 0.9 }}
          >
            {isWatchlisted ? <FaBookmark size={16} /> : <FaRegBookmark size={16} />}
          </motion.button>
        </div>

        <div className="card-body p-1 md:p-2 leading-4">
          <h2 className="card-title">{truncateTitle(title)}</h2>
          <p>Release: {formatDate(release_date)}</p>
          <div className="flex items-center gap-1 md:gap-2">
            {renderStars(vote_average)}
            <span className="text-xs text-gray-600">
              ({getRoundedRating(vote_average)})
            </span>
          </div>
        </div>
      </motion.div>

      <ModalView
        show={showModal}
        handleClose={() => setShowModal(false)}
        title="Login Required"
      >
        <p className="text-gray-400">
          You need to be logged in to add movies to your favorites or watchlist.
        </p>
        <Link
          to="/login"
          className="btn btn-primary w-full"
          onClick={() => setShowModal(false)}
        >
          Go to Login
        </Link>
      </ModalView>
    </>
  );
};

export default MovieContainer;
