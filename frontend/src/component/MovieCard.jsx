import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark } from "react-icons/fa";
import { HiDotsHorizontal } from "react-icons/hi";
import { toast } from "react-toastify";
import {
  useAddToFavoritesMutation,
  useRemoveFromFavoritesMutation,
  useAddToWatchlistMutation,
  useRemoveFromWatchlistMutation,
} from "../redux/api/account";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

const MovieCard = ({ movie, onRequireLogin, favorites = [], watchlist = [], onRefresh }) => {
  const { poster_path, id, title } = movie;
  const { userInfo } = useSelector((state) => state.auth);

  const [favLoading, setFavLoading] = useState(false);
  const [watchLoading, setWatchLoading] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const [isFavorite, setIsFavorite] = useState(false);
  const [isWatchlisted, setIsWatchlisted] = useState(false);

  const [addToFavorites] = useAddToFavoritesMutation();
  const [removeFromFavorites] = useRemoveFromFavoritesMutation();
  const [addToWatchlist] = useAddToWatchlistMutation();
  const [removeFromWatchlist] = useRemoveFromWatchlistMutation();

  useEffect(() => {
    setIsFavorite(favorites.some(item => item.tmdbId === id && item.mediaType === "movie"));
    setIsWatchlisted(watchlist.some(item => item.tmdbId === id && item.mediaType === "movie"));
  }, [favorites, watchlist, id]);

  const handleToggleFavorite = async () => {
    if (!userInfo) return onRequireLogin();
    setFavLoading(true);
    try {
      if (isFavorite) {
        await removeFromFavorites({ tmdbId: id, mediaType: "movie" }).unwrap();
        toast.info("Removed from favorites");
      } else {
        await addToFavorites({ tmdbId: id, mediaType: "movie" }).unwrap();
        toast.success("Added to favorites");
      }
      onRefresh();
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "Favorite action failed");
    } finally {
      setFavLoading(false);
    }
  };

  const handleToggleWatchlist = async () => {
    if (!userInfo) return onRequireLogin();
    setWatchLoading(true);
    try {
      if (isWatchlisted) {
        await removeFromWatchlist({ tmdbId: id, mediaType: "movie" }).unwrap();
        toast.info("Removed from watchlist");
      } else {
        await addToWatchlist({ tmdbId: id, mediaType: "movie" }).unwrap();
        toast.success("Added to watchlist");
      }
      onRefresh();
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "Watchlist action failed");
    } finally {
      setWatchLoading(false);
    }
  };

  return (
    <motion.div
      role="article"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      layout
      className="relative px-2"
    >
      <Link to={`/movie/${id}`} aria-label={`View details for ${title}`}>
        <motion.img
          src={`https://image.tmdb.org/t/p/original/${poster_path}`}
          alt={title}
          className="rounded-lg shadow-sm object-cover w-full max-h-[350px] max-w-xs mx-auto"
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        />
      </Link>

      <motion.button
        onClick={() => setShowActions(prev => !prev)}
        className="absolute top-2 left-4 bg-black/60 text-white p-1 rounded-full"
        title="More actions"
        aria-label="Toggle action menu"
        whileTap={{ scale: 0.9 }}
      >
        <HiDotsHorizontal size={18} />
      </motion.button>

      <AnimatePresence>
        {showActions && (
          <motion.div
            className="absolute top-2 right-4 flex flex-col gap-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <motion.button
              onClick={handleToggleFavorite}
              disabled={favLoading}
              className={`bg-black/60 text-red p-2 rounded-full ${
                isFavorite ? "text-red-500" : ""
              }`}
              title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              aria-label={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              whileTap={{ scale: 0.9 }}
            >
              {isFavorite ? <FaHeart size={18} /> : <FaRegHeart size={18} />}
            </motion.button>
            <motion.button
              onClick={handleToggleWatchlist}
              disabled={watchLoading}
              className={`bg-black/60 text-white p-2 rounded-full ${
                isWatchlisted ? "text-yellow-400" : ""
              }`}
              title={isWatchlisted ? "Remove from Watchlist" : "Add to Watchlist"}
              aria-label={isWatchlisted ? "Remove from Watchlist" : "Add to Watchlist"}
              whileTap={{ scale: 0.9 }}
            >
              {isWatchlisted ? <FaBookmark size={18} /> : <FaRegBookmark size={18} />}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.p
        className="text-white mt-2 font-semibold text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {title}
      </motion.p>
    </motion.div>
  );
};

export default MovieCard;
