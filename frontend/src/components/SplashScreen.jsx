import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    // Navigate to camera after 2.5 seconds
    const timer = setTimeout(() => {
      navigate('/camera', { replace: true });
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#10b981] text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center gap-4"
      >
        <h1 className="text-5xl font-extrabold tracking-tight drop-shadow-md">
          Mi IA eats
        </h1>
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }} 
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          🥑
        </motion.div>
      </motion.div>
    </div>
  );
}
