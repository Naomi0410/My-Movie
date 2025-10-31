import { useState } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  useAddToFavoritesMutation,
  useRemoveFromFavoritesMutation,
  useAddToWatchlistMutation,
  useRemoveFromWatchlistMutation,
} from "../redux/api/account";
import {
  addFavorite,
  removeFavorite,
  addToWatchlist,
  removeFromWatchlist,
} from "../redux/features/account/accountSlice";
import ModalView from "./ModalView";
import { motion } from "framer-motion";

const TvContainer = ({ tv }) => {
  const { poster_path, id, name, release_date, vote_average } = tv;
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { favorites, watchlist } = useSelector((state) => state.account);

  const [favLoading, setFavLoading] = useState(false);
  const [watchLoading, setWatchLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

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

  const truncateName = (text, maxLength = 15) =>
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
    if (!userInfo) {
      setShowModal(true);
      return;
    }
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
      dispatch(isWatchlisted ? addToWatchlist(item) : removeFromWatchlist(item)); // rollback
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
        aria-label={`TV card for ${name}`}
      >
        <Link to={`/tv/${id}`} aria-label={`View details for ${name}`}>
          <figure>
            <img
              src={`https://image.tmdb.org/t/p/w342${poster_path}`}
              alt={`Poster of ${name}`}
              className="rounded-sm shadow-sm object-center w-full border-b-2 border-black h-[150px] md:h-[180px] lg:h-[200px] max-w-xs mx-auto hover:opacity-80 transition-opacity duration-300"
              loading="lazy"
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
          <h2 className="card-title" title={name}>
            {truncateName(name)}
          </h2>
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
          You need to be logged in to add TV shows to your favorites or watchlist.
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

export default TvContainer;
