import { Link } from "react-router-dom";
import {
  useRemoveFromFavoritesMutation,
  useRemoveFromWatchlistMutation,
} from "../redux/api/account";
import { toast } from "react-toastify";
import { TbTrash } from "react-icons/tb";
import { motion } from "framer-motion";

const MediaCard = ({ item, onRemove, source }) => {
  const {
    tmdbId,
    mediaType,
    posterPath,
    title,
    name,
    releaseDate,
    voteAverage,
  } = item;

  const route = mediaType === "movie" ? `/movie/${tmdbId}` : `/tv/${tmdbId}`;
  const displayTitle = title || name;

  const [removeFromFavorites] = useRemoveFromFavoritesMutation();
  const [removeFromWatchlist] = useRemoveFromWatchlistMutation();

  const handleRemove = async () => {
    try {
      const payload = { tmdbId, mediaType };

      if (source === "favorites") {
        await removeFromFavorites(payload).unwrap();
      } else if (source === "watchlist") {
        await removeFromWatchlist(payload).unwrap();
      }

      toast.success(`${displayTitle} removed from ${source}`);
      if (onRemove) onRemove(tmdbId);
    } catch (err) {
      toast.error(`Failed to remove from ${source}`);
      console.error("Remove error:", err);
    }
  };

  const renderStars = (rating) => {
    const stars = Math.round(rating / 2);
    return (
      <div className="rating rating-xs" aria-label={`Rated ${rating} out of 10`}>
        {[...Array(5)].map((_, i) => (
          <input
            key={i}
            type="radio"
            name={`rating-${mediaType}-${tmdbId}`}
            className="mask mask-star-2 bg-rose-400"
            checked={i < stars}
            readOnly
          />
        ))}
      </div>
    );
  };

  return (
    <motion.div
      role="article"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      layout
      className="flex items-center bg-white shadow-md rounded-lg p-3 overflow-hidden mb-4 hover:shadow-lg transition-shadow"
    >
      <Link to={route} aria-label={`View details for ${displayTitle}`}>
        <img
          src={`https://image.tmdb.org/t/p/w200${posterPath}`}
          alt={displayTitle}
          className="w-[100px] h-[150px] object-cover rounded-xl"
        />
      </Link>

      <div className="p-3 flex flex-col justify-between gap-2 flex-1">
        <div>
          <h3 className="font-bold text-black text-lg">{displayTitle}</h3>
          <p className="text-sm font-bold text-gray-700">
            Release:{" "}
            <span className="text-gray-600 font-normal">
              {releaseDate || "Unknown"}
            </span>
          </p>
          <p className="text-sm font-bold text-gray-700">
            Rating: <span>{voteAverage || "N/A"}</span>
          </p>
          {voteAverage && renderStars(voteAverage)}
        </div>
      </div>

      <button
        onClick={handleRemove}
        className="flex items-center text-sm text-rose-600 hover:text-rose-800 mt-2 self-start"
        aria-label={`Remove ${displayTitle} from ${source}`}
      >
        <TbTrash size="18px" className="mr-1" />
        Remove
      </button>
    </motion.div>
  );
};

export default MediaCard;
