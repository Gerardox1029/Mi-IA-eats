import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Send } from 'lucide-react';

export default function Chat({ onClose }) {
  const [messages, setMessages] = useState([
    { id: 1, text: "¡Hola! Soy tu nutri-amigo 🐊. ¡Esa comida se ve genial! No hay alimentos malos, solo porciones divertidas. ¿Qué quieres saber?", sender: "bot" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    // Add user message
    const newMsg = { id: Date.now(), text: input, sender: "user" };
    setMessages(prev => [...prev, newMsg]);
    setInput("");
    setIsTyping(true);

    try {
      // Current history with the message we just added
      const currentHistory = [...messages, newMsg];
      
      const backendUrl = window.location.origin.includes('localhost') 
        ? 'http://localhost:5000' 
        : window.location.origin; // Assume same domain if not localhost

      const response = await fetch(`${backendUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, history: currentHistory })
      });
      const data = await response.json();
      
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        id: Date.now()+1, 
        text: data.reply || "No tengo palabras 🐊", 
        sender: "bot" 
      }]);
    } catch (err) {
      console.error(err);
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        id: Date.now()+1, 
        text: "Parece que mi conexión está fallando 🐊😢", 
        sender: "bot" 
      }]);
    }
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
      />
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed bottom-0 left-0 right-0 h-[80vh] max-h-[80vh] bg-neutral-50 rounded-t-3xl shadow-2xl z-[60] flex flex-col pt-2"
      >
        {/* Draggable indicator */}
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto my-2" />
        
        <div className="flex justify-between items-center px-6 py-2 border-b border-gray-100 bg-white rounded-t-2xl shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-xl">🐊</div>
            <div>
              <h3 className="font-bold text-[var(--color-dark-green)]">Nutri-Croc</h3>
              <p className="text-xs text-green-600 font-medium">En línea</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 bg-gray-50 rounded-full">
            <X size={20} />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {messages.map(msg => (
            <div 
              key={msg.id} 
              className={`max-w-[80%] p-4 rounded-2xl text-[15px] leading-relaxed shadow-sm ${
                msg.sender === 'user' 
                  ? 'bg-[var(--color-primary-green)] text-white self-end rounded-br-sm' 
                  : 'bg-white text-gray-800 border border-gray-100 self-start rounded-bl-sm'
              }`}
            >
              {msg.text}
            </div>
          ))}
          {isTyping && (
            <div className="max-w-[80%] p-4 rounded-2xl bg-white border border-gray-100 self-start rounded-bl-sm shadow-sm flex items-center gap-1">
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-2 h-2 bg-gray-400 rounded-full" />
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2 h-2 bg-gray-400 rounded-full" />
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-2 h-2 bg-gray-400 rounded-full" />
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="p-4 bg-white border-t border-gray-100 shrink-0 mb-4">
          <form onSubmit={handleSend} className="flex flex-row items-center gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pregúntale al cocodrilo..."
              className="flex-1 bg-gray-100 rounded-full px-5 py-3 outline-none focus:ring-2 focus:ring-[var(--color-primary-green)] transition-all"
            />
            <button 
              type="submit"
              disabled={!input.trim() || isTyping}
              className="w-12 h-12 rounded-full bg-[var(--color-primary-green)] text-white flex items-center justify-center disabled:opacity-50 disabled:bg-gray-300 transition-colors shrink-0"
            >
              <Send size={18} className="translate-x-[2px]" />
            </button>
          </form>
        </div>
      </motion.div>
    </>
  );
}
