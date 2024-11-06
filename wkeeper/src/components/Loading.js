import { AnimatePresence, motion } from 'framer-motion';
import Spinner from './Spinner'; // Импортируйте компонент Spinner, если он в отдельном файле

const LoadingComponent = ({ width = '100%', height = '100vh' }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="loading-container bg-[#17212B] flex items-center justify-center backdrop-blur-lg"
        style={{ width, height }} // Применяем width и height из пропсов
      >
        <Spinner size="lg" />
      </motion.div>
    </AnimatePresence>
  );
};

export default LoadingComponent;