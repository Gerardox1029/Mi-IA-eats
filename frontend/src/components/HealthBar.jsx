import React from 'react';
import { motion } from 'framer-motion';

const HEALTH_LEVELS = [
  { index: 1, label: "Ni una más este mes...", color: "bg-red-500" },
  { index: 2, label: "Una vez al año...", color: "bg-orange-500" },
  { index: 3, label: "Hace cosquillas", color: "bg-amber-400" },
  { index: 4, label: "Meh, no suma ni resta...", color: "bg-yellow-400" },
  { index: 5, label: "Buen aporte", color: "bg-lime-400" },
  { index: 6, label: "Muy buen recurso", color: "bg-green-400" },
  { index: 7, label: "UGA UGA", color: "bg-[var(--color-primary-green)]" },
];

export default function HealthBar({ levelIndex = 4, label = "Meh, no suma ni resta..." }) {
  // Normalize index 1-7 to 0-6 for array
  const activeIndex = Math.max(0, Math.min(6, levelIndex - 1));
  const activeColor = HEALTH_LEVELS[activeIndex].color;

  return (
    <div className="w-full bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col gap-4">
      <div className="flex justify-between items-center px-1">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Nivel de Salud</h3>
        <span className="text-xl font-black text-[var(--color-dark-green)]">{levelIndex}/7</span>
      </div>
      
      {/* Progress Bar Container */}
      <div className="relative w-full h-8 bg-gray-100 rounded-full overflow-hidden flex">
        {HEALTH_LEVELS.map((level, i) => (
          <div 
            key={level.index}
            className={`flex-1 h-full border-r-2 border-white last:border-r-0 ${level.color} opacity-40`}
          />
        ))}

        {/* Dynamic filled bar */}
        <motion.div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-500 via-yellow-400 to-[var(--color-primary-green)] rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: `${(levelIndex / 7) * 100}%` }}
          transition={{ duration: 1, type: "spring", bounce: 0.2 }}
        />
        
        {/* Glow overlay pin */}
        <motion.div
          className="absolute top-0 bottom-0 w-2 bg-white/50 backdrop-blur-sm -ml-1 z-10"
          initial={{ left: '0%' }}
          animate={{ left: `${(levelIndex / 7) * 100}%` }}
          transition={{ duration: 1, type: "spring", bounce: 0.2 }}
        />
      </div>

      <div className="flex justify-center items-center mt-1">
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-lg font-bold text-center text-[var(--color-dark-green)]"
        >
          {label}
        </motion.p>
      </div>
    </div>
  );
}
