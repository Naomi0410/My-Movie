import { useState } from "react";
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
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  addFavorite,
  removeFavorite,
  addToWatchlist,
  removeFromWatchlist,
} from "../redux/features/account/accountSlice";

const TVCard = ({ tv, onRequireLogin }) => {
  const { poster_path, id, name } = tv;
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { favorites, watchlist } = useSelector((state) => state.account);

  const [favLoading, setFavLoading] = useState(false);
  const [watchLoading, setWatchLoading] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const [addToFavoritesMutation] = useAddToFavoritesMutation();
  const [removeFromFavoritesMutation] = useRemoveFromFavoritesMutation();
  const [addToWatchlistMutation] = useAddToWatchlistMutation();
  const [removeFromWatchlistMutation] = useRemoveFromWatchlistMutation();

  const isFavorite = favorites.some(
    (item) => item.tmdbId === id && item.mediaType === "tv"
  );
  const isWatchlisted = watchlist.some(
    (item) => item.tmdbId === id && item.mediaType === "tv"
  );

  const handleToggleFavorite = async () => {
    if (!userInfo) return onRequireLogin();
    setFavLoading(true);

    const item = { tmdbId: id, mediaType: "tv" };

    try {
      if (isFavorite) {
        dispatch(removeFavorite(item));
        await removeFromFavoritesMutation(item).unwrap();
        toast.info("Removed from favorites");
      } else {
        dispatch(addFavorite(item));
        await addToFavoritesMutation(item).unwrap();
        toast.success("Added to favorites");
      }
    } catch (err) {
      dispatch(isFavorite ? addFavorite(item) : removeFavorite(item)); // rollback
      toast.error(err?.data?.message || err?.error || "Favorite action failed");
    } finally {
      setFavLoading(false);
    }
  };

  const handleToggleWatchlist = async () => {
    if (!userInfo) return onRequireLogin();
    setWatchLoading(true);

    const item = { tmdbId: id, mediaType: "tv" };

    try {
      if (isWatchlisted) {
        dispatch(removeFromWatchlist(item));
        await removeFromWatchlistMutation(item).unwrap();
        toast.info("Removed from watchlist");
      } else {
        dispatch(addToWatchlist(item));
        await addToWatchlistMutation(item).unwrap();
        toast.success("Added to watchlist");
      }
    } catch (err) {
      dispatch(
        isWatchlisted ? addToWatchlist(item) : removeFromWatchlist(item)
      );
      toast.error(
        err?.data?.message || err?.error || "Watchlist action failed"
      );
    } finally {
      setWatchLoading(false);
    }
  };

  const truncateTitle = (text, maxLength = 30) =>
    text.length > maxLength ? text.slice(0, maxLength) + "..." : text;

  return (
    <motion.div
      role="article"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      layout
      className="relative px-2"
    >
      <Link to={`/tv/${id}`} aria-label={`View details for ${name}`}>
        <motion.img
          src={`https://image.tmdb.org/t/p/w342/${poster_path}`}
          alt={name}
          className="rounded-lg shadow-sm object-cover w-full max-h-[350px] max-w-xs mx-auto"
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
          loading="lazy"
        />
      </Link>

      <motion.button
        onClick={() => setShowActions((prev) => !prev)}
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
              className={`bg-black/60 p-2 rounded-full ${
                isFavorite ? "text-red-500" : "text-white"
              }`}
              title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              aria-label={
                isFavorite ? "Remove from Favorites" : "Add to Favorites"
              }
              whileTap={{ scale: 0.9 }}
            >
              <motion.div
                animate={favLoading ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.4 }}
              >
                {isFavorite ? <FaHeart size={18} /> : <FaRegHeart size={18} />}
              </motion.div>
            </motion.button>

            <motion.button
              onClick={handleToggleWatchlist}
              disabled={watchLoading}
              className={`bg-black/60 p-2 rounded-full ${
                isWatchlisted ? "text-yellow-400" : "text-white"
              }`}
              title={
                isWatchlisted ? "Remove from Watchlist" : "Add to Watchlist"
              }
              aria-label={
                isWatchlisted ? "Remove from Watchlist" : "Add to Watchlist"
              }
              whileTap={{ scale: 0.9 }}
            >
              <motion.div
                animate={watchLoading ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.4 }}
              >
                {isWatchlisted ? (
                  <FaBookmark size={18} />
                ) : (
                  <FaRegBookmark size={18} />
                )}
              </motion.div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
      <Link to={`/tv/${id}`} aria-label={`View details for ${name}`}>
        <h2 className="card-title" title={name}>
          {truncateTitle(name)}
        </h2>
      </Link>
    </motion.div>
  );
};

export default TVCard;
