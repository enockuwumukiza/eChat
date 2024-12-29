import { motion } from 'framer-motion';

const SendingAnimation = () => {
  return (
    <motion.div
      className="absolute flex bottom-[90%] items-center justify-center bg-blue-100 rounded-lg shadow-xl"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      style={{ maxWidth: '200px' }}
    >
      {/* Text with bounce effect */}
      <motion.p
        className="text-lg font-semibold text-gray-700"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
      >
        Sending <span className="loading loading-dots loading-md absolute"></span>
      </motion.p>

      {/* Loading Spinner with scale and pulse effect */}
      <motion.div
        className="ml-2 w-6 h-6 border-t-4 border-gray-500 border-solid rounded-full animate-spin"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1.2 }}
        transition={{
          loop: Infinity,
          duration: 1,
          ease: "easeInOut",
          repeatType: "reverse",
        }}
      />

      {/* Fade-in glowing effect for the container with subtle pulse */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-200 via-purple-300 to-pink-300 rounded-lg opacity-30"
        initial={{ opacity: 0, scale: 1 }}
        animate={{ opacity: 0.3, scale: [1, 1.05, 1] }}
        transition={{
          delay: 0.5,
          duration: 2,
          ease: "easeOut",
          repeat: Infinity,
          repeatDelay: 2,
        }}
      />
    </motion.div>
  );
};

export default SendingAnimation;