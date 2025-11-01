import { motion } from "framer-motion";

const Loader = () => {
  return (
    <motion.div
      role="status"
      aria-label="Loading"
      className="flex justify-center items-center h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="rounded-full h-16 w-16 border-t-4 bg-cyan-700 border-opacity-50"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
    </motion.div>
  );
};

export default Loader;
