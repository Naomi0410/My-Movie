import { motion, AnimatePresence } from "framer-motion";

export default function ModalView({ show, handleClose, title, children }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="modal-box bg-white rounded-lg shadow-lg p-6 relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            <div className="flex text-black justify-between items-center mb-4">
              <h3 id="modal-title" className="font-bold text-xl">
                {title}
              </h3>
              <button
                onClick={handleClose}
                className="text-xl font-bold"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
