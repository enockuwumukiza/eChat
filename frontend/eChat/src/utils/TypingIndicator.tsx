
import { motion } from 'framer-motion';

const TypingIndicator = ({ name }: { name: string }) => {
  return (
    <motion.div
      className="absolute bottom-10 md:bottom-16 lg:bottom-12 flex items-center space-x-2 p-2 rounded-lg bg-primary text-white shadow-md w-[95px] md:w-[150px] lg:w-[100px]"
      initial={{ opacity: 0, y: 10 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: [1, 1.05, 1], // Adds a subtle scale animation
      }}
      exit={{ opacity: 0, y: 10 }}
      transition={{
        duration: 0.3,
        scale: { repeat: Infinity, duration: 1.5, ease: 'easeInOut' }, // Loops scale animation
      }}
    >
      <span className="font-bold text-[10px] md:text-[20px] lg:text-[30px]">{name}</span>
      <div className="flex space-x-1">
        <motion.span
          className="w-2 h-2 bg-white rounded-full"
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ repeat: Infinity, duration: 1, ease: 'easeInOut' }}
        ></motion.span>
        <motion.span
          className="w-2 h-2 bg-white rounded-full"
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: 'easeInOut',
            delay: 0.2,
          }}
        ></motion.span>
        <motion.span
          className="w-2 h-2 bg-white rounded-full"
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: 'easeInOut',
            delay: 0.4,
          }}
        ></motion.span>
      </div>
    </motion.div>
  );
};

export default TypingIndicator;
