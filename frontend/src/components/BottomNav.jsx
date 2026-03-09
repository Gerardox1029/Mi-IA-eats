import React from 'react';
import { NavLink } from 'react-router-dom';
import { Camera, Utensils } from 'lucide-react';

export default function BottomNav() {
  return (
    <nav className="h-[80px] bg-white border-t border-gray-100 flex shadow-[0_-4px_20px_rgba(0,0,0,0.03)] z-50 shrink-0">
      <NavLink 
        to="/camera" 
        className={({ isActive }) => 
          `flex-1 flex flex-col items-center justify-center gap-1 transition-colors ${
            isActive ? 'text-[var(--color-primary-green)]' : 'text-gray-400'
          }`
        }
      >
        <Camera size={28} strokeWidth={2.5} />
        <span className="text-xs font-semibold">Cámara</span>
      </NavLink>
      
      <NavLink 
        to="/data" 
        className={({ isActive }) => 
          `flex-1 flex flex-col items-center justify-center gap-1 transition-colors ${
            isActive ? 'text-[var(--color-primary-green)]' : 'text-gray-400'
          }`
        }
      >
        <Utensils size={28} strokeWidth={2.5} />
        <span className="text-xs font-semibold">Data Eats</span>
      </NavLink>
    </nav>
  );
}
