import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Skull } from 'lucide-react';

const FlipCard = ({ type, text }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  
  const isPro = type === 'pro';
  const Icon = isPro ? Leaf : Skull;
  const colorClass = isPro ? 'from-emerald-400 to-green-500' : 'from-red-400 to-rose-500';
  const label = isPro ? 'Lo Mejor' : 'La Advertencia';

  return (
    <div className="relative w-full h-48 [perspective:1000px]">
      <motion.div 
        className="w-full h-full relative [transform-style:preserve-3d] cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* Front */}
        <div className={`absolute inset-0 w-full h-full backface-hidden rounded-3xl p-6 flex flex-col items-center justify-center gap-4 bg-gradient-to-br ${colorClass} text-white shadow-lg`} style={{ backfaceVisibility: 'hidden' }}>
          <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
            <Icon size={40} className="text-white" strokeWidth={2.5} />
          </div>
          <h4 className="text-xl font-black tracking-wide">{label}</h4>
          <p className="text-xs text-white/80 font-medium">Toca para descubrir</p>
        </div>
        
        {/* Back */}
        <div 
          className="absolute inset-0 w-full h-full backface-hidden rounded-3xl p-6 bg-white border-2 flex items-center justify-center shadow-md overflow-hidden" 
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className={`absolute top-0 w-full h-1 ${isPro ? 'bg-green-500' : 'bg-rose-500'}`} />
          <p className="text-center font-medium text-gray-700 leading-snug">
            {text}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default function FlipCards({ insights }) {
  return (
    <div className="flex flex-col gap-4 w-full">
      <FlipCard type="pro" text={insights.bestFeature} />
      <FlipCard type="con" text={insights.worstFeature} />
    </div>
  );
}
