import { motion, AnimatePresence } from 'framer-motion';
import Spinner from './Spinner';

const LoadingComponent = () => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1}}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="loading-container w-full h-screen bg-[#7177F8] flex items-center justify-center"
      >
        <Spinner size="lg" />
      </motion.div>
    </AnimatePresence>
  );
};

export default LoadingComponent;
