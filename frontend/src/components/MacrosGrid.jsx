import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Beef, Droplet, Wheat } from 'lucide-react';

const MACRO_CONFIG = {
  calories: { icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50', label: 'Calorías' },
  proteins: { icon: Beef, color: 'text-rose-500', bg: 'bg-rose-50', label: 'Proteínas' },
  fats: { icon: Droplet, color: 'text-yellow-500', bg: 'bg-yellow-50', label: 'Grasas' },
  carbs: { icon: Wheat, color: 'text-amber-600', bg: 'bg-amber-50', label: 'Carbohidratos' }
};

const MacroCard = ({ type, data, delay }) => {
  const config = MACRO_CONFIG[type];
  const Icon = config.icon;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: "spring", bounce: 0.4 }}
      className={`${config.bg} rounded-3xl p-4 flex flex-col justify-between border border-white/50 shadow-sm aspect-square`}
    >
      <div className="flex justify-between items-start">
        <div className={`p-2 rounded-2xl bg-white shadow-sm ${config.color}`}>
          <Icon size={24} strokeWidth={2.5} />
        </div>
        <span className="text-[10px] font-bold uppercase py-1 px-2 bg-white/60 rounded-full text-gray-500">
          {data.level}
        </span>
      </div>
      
      <div className="mt-4">
        <p className="text-gray-500 text-xs font-semibold mb-1">{config.label}</p>
        <p className={`text-xl font-black ${config.color.replace('text-', 'text-gray-800')}`}>
          {data.value}
        </p>
      </div>
    </motion.div>
  );
};

export default function MacrosGrid({ macros }) {
  return (
    <div className="grid grid-cols-2 gap-4 w-full">
      <MacroCard type="calories" data={macros.calories} delay={0.1} />
      <MacroCard type="proteins" data={macros.proteins} delay={0.2} />
      <MacroCard type="fats" data={macros.fats} delay={0.3} />
      <MacroCard type="carbs" data={macros.carbs} delay={0.4} />
    </div>
  );
}
