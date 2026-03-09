import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Chat from './Chat';

export default function Mascot() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isDancing, setIsDancing] = useState(false);

  useEffect(() => {
    // Listen for custom event triggered by Action Button
    const handleDance = () => {
      setIsDancing(true);
      setTimeout(() => setIsDancing(false), 3000);
    };
    window.addEventListener('dance-mascot', handleDance);
    return () => window.removeEventListener('dance-mascot', handleDance);
  }, []);

  // Animation values for walking along the edge
  // Relative to the absolute container (#root)
  const defaultWalk = {
    left: ["calc(100% - 80px)", "16px", "16px", "calc(100% - 80px)", "calc(100% - 80px)"],
    top: ["calc(100% - 150px)", "calc(100% - 150px)", "16px", "16px", "calc(100% - 150px)"],
    rotate: [0, -10, 0, 10, 0]
  };

  const danceAnim = {
    scale: [1, 1.4, 1, 1.4, 1],
    rotate: [0, 45, -45, 45, 0],
    top: ["calc(100% - 150px)", "calc(100% - 180px)", "calc(100% - 150px)", "calc(100% - 180px)", "calc(100% - 150px)"],
    left: "calc(100% - 80px)"
  };

  return (
    <>
      <motion.button
        className="absolute w-16 h-16 bg-white border-4 border-green-200 shadow-xl rounded-full flex items-center justify-center z-40"
        animate={isDancing ? danceAnim : defaultWalk}
        transition={{ 
          duration: isDancing ? 2 : 20, 
          ease: "linear",
          repeat: isDancing ? 0 : Infinity
        }}
        onClick={() => setIsChatOpen(true)}
      >
        <div className="text-3xl filter drop-shadow-sm">🐊</div>
        
        {/* Notification dot */}
        <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
      </motion.button>

      {/* Chat Bottom Sheet */}
      <AnimatePresence>
        {isChatOpen && <Chat onClose={() => setIsChatOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
