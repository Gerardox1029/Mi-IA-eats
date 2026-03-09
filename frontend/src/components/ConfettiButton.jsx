import React from 'react';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';

export default function ConfettiButton({ onClick }) {
  const handleClick = (e) => {
    // Generate emoji confetti
    const defaults = {
      spread: 90,
      ticks: 100,
      gravity: 0.5,
      decay: 0.94,
      startVelocity: 30,
      shapes: ['star'],
      colors: ['#FFE400', '#FFBD00', '#E89400', '#FFCA6C', '#FDFFB8']
    };

    const runConfetti = () => {
      // Emojis mapping
      const emojiShapes = confetti.shapeFromText({ text: '🥑' });
      const emojiShapes2 = confetti.shapeFromText({ text: '🔥' });

      confetti({
        ...defaults,
        particleCount: 20,
        shapes: [emojiShapes],
        scalar: 2
      });
      confetti({
        ...defaults,
        particleCount: 20,
        shapes: [emojiShapes2],
        scalar: 2
      });
    };

    runConfetti();
    // Emit event to make the mascot dance
    window.dispatchEvent(new Event('dance-mascot'));
    
    if (onClick) onClick(e);
  };

  return (
    <motion.button 
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className="w-full bg-[#10b981] text-white py-5 rounded-2xl font-black text-xl shadow-lg shadow-[#10b981]/30 active:shadow-none mb-4"
    >
      ¡Me lo comeré!
    </motion.button>
  );
}
