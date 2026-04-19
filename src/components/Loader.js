import { motion } from "framer-motion";

const Loader = () => (
  <div
    className="flex flex-col items-center justify-center py-24"
    role="status"
    aria-live="polite"
    aria-label="Fetching news"
  >
    <motion.div
      className="w-16 h-16 border-4 border-t-blue-500 border-gray-300 rounded-full motion-safe:animate-spin"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    />
    <p className="text-lg font-semibold text-gray-700 mt-4">Fetching news...</p>
  </div>
);

export default Loader;
