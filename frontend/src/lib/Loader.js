import React from 'react'
import { motion } from 'framer-motion';

const Loader = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 z-50">
    <motion.div
      className="w-16 h-16 border-4 border-blue-500 rounded-full"
      animate={{
        rotate: 360,
        borderRadius: ["50%", "25%", "50%"],
      }}
      transition={{
        duration: 2,
        ease: "linear",
        repeat: Infinity,
      }}
    >
      <motion.div
        className="w-full h-full bg-blue-500 rounded-full"
        animate={{
          scale: [1, 0.8, 1],
        }}
        transition={{
          duration: 1,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />
    </motion.div>
    <div className="text-blue-500 text-3xl mt-2 font-bold">Facebook</div>
  </div>
  )
}

export default Loader