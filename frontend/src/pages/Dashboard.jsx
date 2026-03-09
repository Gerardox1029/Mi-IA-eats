import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import HealthBar from '../components/HealthBar';
import MacrosGrid from '../components/MacrosGrid';
import FlipCards from '../components/FlipCards';
import ConfettiButton from '../components/ConfettiButton';

// Dummy data representing exactly the expected JSON from Gemini API
const dummyData = {
  healthLevel: { index: 5, label: "Buen aporte" },
  macros: {
    calories: { level: "Medio", value: "320 Kcal" },
    proteins: { level: "Alto", value: "25 g" },
    fats: { level: "Medio", value: "12 g" },
    carbs: { level: "Bajo", value: "15 g" }
  },
  insights: {
    bestFeature: "Gran cantidad de proteína magra que ayudará a la recuperación muscular y brindará saciedad por mucho tiempo.",
    worstFeature: "El aderezo aporta un ligero exceso de sodio, ten cuidado con las porciones extra."
  }
};

export default function Dashboard() {
  const location = useLocation();
  
  // Safe extraction with fallbacks to avoid white screen crash
  const rawData = location.state?.analysisData || dummyData;
  const data = {
    healthLevel: rawData.healthLevel || dummyData.healthLevel,
    macros: rawData.macros || dummyData.macros,
    insights: rawData.insights || dummyData.insights
  };

  return (
    <div className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-8 pb-24">
      <header className="flex flex-col gap-1 items-center mb-2">
        <h2 className="text-3xl font-black text-[var(--color-dark-green)] tracking-tight">Análisis</h2>
        <p className="text-gray-500 font-medium">Nutrición simplificada</p>
      </header>

      {/* Módulo A - Health Bar */}
      <HealthBar levelIndex={data.healthLevel.index} label={data.healthLevel.label} />
      
      {/* Módulo B - Macros */}
      <MacrosGrid macros={data.macros} />
      
      {/* Módulo C - Pros/Cons */}
      <FlipCards insights={data.insights} />
      
      {/* Módulo D - Action Button */}
      <div className="mt-4 pb-20"> 
        {/* Extra padding to prevent nav overlap if needed */}
        <ConfettiButton onClick={() => console.log("Eating it!")} />
      </div>
    </div>
  );
}
