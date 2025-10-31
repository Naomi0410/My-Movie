import { useGetWatchlistQuery } from "../../redux/api/account";
import MediaCard from "../../component/MediaCard";
import { motion } from "framer-motion";

const Watchlist = () => {
  const { data: watchlist = [] } = useGetWatchlistQuery();

  return (
    <motion.div
      className="mx-auto 2xl:container px-3 md:px-8 lg:px-12 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      role="main"
      aria-label="Watchlist Page"
    >
      <h2 className="text-xl font-bold mb-4">Your Watchlist</h2>

      {watchlist.length === 0 ? (
        <p className="text-gray-400">No items in your watchlist.</p>
      ) : (
        <div className="space-y-6">
          {watchlist.map((item, index) => (
            <motion.div
              key={`${item.tmdbId}-${item.mediaType}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <MediaCard item={item} source="watchlist" />
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Watchlist;
