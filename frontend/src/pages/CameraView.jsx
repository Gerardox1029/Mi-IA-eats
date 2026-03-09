import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ZapOff, X } from 'lucide-react';

export default function CameraView() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  
  const [stream, setStream] = useState(null);
  const [flashOn, setFlashOn] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [questionText, setQuestionText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize camera
  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [startCamera]); // purposely omit stream from dependency to avoid loop

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      setPhoto(dataUrl);
      setShowBottomSheet(true);
    }
  };

  const retakePhoto = () => {
    setPhoto(null);
    setShowBottomSheet(false);
    setQuestionText('');
  };

  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const loadingTexts = [
    "Analizando ingredientes...",
    "Calculando calorías...",
    "Determinando si es saludable...",
    "Consultando con Nutri-Croc 🐊..."
  ];

  useEffect(() => {
    let interval;
    if (isSubmitting) {
      interval = setInterval(() => {
        setLoadingTextIndex(prev => (prev + 1) % loadingTexts.length);
      }, 1500);
    } else {
      setLoadingTextIndex(0);
    }
    return () => clearInterval(interval);
  }, [isSubmitting]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: photo, userPrompt: questionText })
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || "Server error");
      
      setIsSubmitting(false);
      navigate('/data', { state: { analysisData: data } });
    } catch (err) {
      console.error(err);
      alert("Error al analizar la imagen: " + (err.message || "Error desconocido"));
      setIsSubmitting(false);
    }
  };

  // Pinch to zoom logic can be complex for native web, just stubbing visual touch area
  // We'll rely on the default viewport behavior or add a simple state if needed.

  return (
    <div className="relative w-full h-full bg-black overflow-hidden flex flex-col">
      {/* Viewfinder */}
      <div className="flex-1 relative">
        {!photo ? (
          <video 
            ref={videoRef}
            autoPlay 
            playsInline 
            muted 
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <img src={photo} alt="Captured" className="absolute inset-0 w-full h-full object-cover" />
        )}
        
        <canvas ref={canvasRef} className="hidden" />

        {/* Focus Guide Overlay (Responsive overlay) */}
        {!photo && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-64 h-64 border-2 border-[rgba(255,255,255,0.4)] rounded-2xl relative">
              {/* Corner brackets simulating focus */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[var(--color-primary-green)] rounded-tl-xl" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[var(--color-primary-green)] rounded-tr-xl" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[var(--color-primary-green)] rounded-bl-xl" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[var(--color-primary-green)] rounded-br-xl" />
            </div>
          </div>
        )}

        {/* Flash Toggle */}
        <button 
          onClick={() => setFlashOn(!flashOn)}
          className="absolute top-6 right-6 w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white"
        >
          {flashOn ? <Zap size={24} fill="white" /> : <ZapOff size={24} />}
        </button>
      </div>

      {/* Constraints for thumb accessibility */}
      {!showBottomSheet && (
        <div className="absolute bottom-[20px] left-0 right-0 flex justify-center pb-[80px]"> 
          {/* Capture Button with Framer Motion waves */}
          <div className="relative flex items-center justify-center">
            {/* Infinite wave animation */}
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="absolute w-20 h-20 rounded-full bg-[var(--color-primary-green)]/30"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.8, 0.2, 0.8] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: 0.5 }}
              className="absolute w-20 h-20 rounded-full bg-[var(--color-primary-green)]/40"
            />
            
            <button 
              onClick={takePhoto}
              className="relative w-16 h-16 rounded-full bg-white border-4 border-gray-300 shadow-xl z-10 flex items-center justify-center active:scale-95 transition-transform"
              aria-label="Take photo"
            >
              <div className="w-12 h-12 rounded-full border-2 border-[var(--color-primary-green)]" />
            </button>
          </div>
        </div>
      )}

      {/* Bottom Sheet for prompt */}
      <AnimatePresence>
        {showBottomSheet && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 z-40 backdrop-blur-sm"
            />
            
            {/* Loading Overlay when submitting */}
            {isSubmitting && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 z-50 flex flex-col items-center justify-center px-6 text-center"
              >
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="w-16 h-16 border-4 border-[var(--color-primary-green)] border-t-transparent rounded-full mb-6"
                />
                <AnimatePresence mode="wait">
                  <motion.p 
                    key={loadingTextIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-white text-xl font-bold max-w-xs drop-shadow-md"
                  >
                    {loadingTexts[loadingTextIndex]}
                  </motion.p>
                </AnimatePresence>
              </motion.div>
            )}

            {!isSubmitting && (
              <motion.div 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 z-50 shadow-2xl flex flex-col gap-4 pb-12"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-bold text-[var(--color-dark-green)]">¿Qué estás comiendo?</h3>
                  <button onClick={retakePhoto} className="p-2 -mr-2 text-gray-400 bg-transparent hover:bg-transparent">
                    <X size={24} />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <input 
                    type="text" 
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    placeholder="Ej: Ensalada césar con pollo..."
                    className="w-full bg-gray-100 rounded-xl px-4 py-4 text-lg outline-none focus:ring-2 focus:ring-[var(--color-primary-green)] transition-all"
                    autoFocus
                  />
                  
                  <button 
                    type="submit"
                    disabled={!questionText.trim()}
                    className="w-full bg-[var(--color-primary-green)] text-white font-bold text-lg rounded-xl py-4 flex items-center justify-center shadow-lg shadow-[var(--color-primary-green)]/30 disabled:opacity-50 disabled:shadow-none transition-all active:scale-[0.98]"
                  >
                    Analizar con IA
                  </button>
                </form>
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
