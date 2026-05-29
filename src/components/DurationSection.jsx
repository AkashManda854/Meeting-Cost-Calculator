import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

export default function DurationSection({ duration, setDuration }) {
  const handleSliderChange = (e) => {
    setDuration(parseInt(e.target.value));
  };

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= 480) {
      setDuration(value);
    }
  };

  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Glowing border effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 via-cyan-500 to-violet-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>

      <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Meeting Duration</h2>
          </div>
          <motion.div
            className="text-3xl font-bold text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 0.3, repeat: duration % 5 === 0 ? 1 : 0 }}
          >
            {duration}m
          </motion.div>
        </div>

        {/* Slider */}
        <div className="mb-6">
          <input
            type="range"
            min="1"
            max="480"
            value={duration}
            onChange={handleSliderChange}
            className="w-full h-2 bg-slate-700/50 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, 
                rgb(34, 211, 238) 0%, 
                rgb(139, 92, 246) ${duration / 4.8}%, 
                rgb(71, 85, 105) ${duration / 4.8}%, 
                rgb(71, 85, 105) 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>1 min</span>
            <span>30 min</span>
            <span>480 min</span>
          </div>
        </div>

        {/* Custom input */}
        <div className="flex items-center gap-4">
          <input
            type="number"
            value={duration}
            onChange={handleInputChange}
            min="1"
            max="480"
            className="flex-1 px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white text-center font-semibold focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
          />
          <span className="text-gray-400">minutes</span>
        </div>

        {/* Duration suggestions */}
        <div className="mt-6 grid grid-cols-4 gap-2">
          {[15, 30, 60, 90].map((min) => (
            <motion.button
              key={min}
              onClick={() => setDuration(min)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`py-2 px-3 rounded-lg font-semibold transition ${
                duration === min
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white'
                  : 'bg-slate-800/40 text-gray-300 hover:bg-slate-800/60 border border-slate-700/30'
              }`}
            >
              {min}m
            </motion.button>
          ))}
        </div>
      </div>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgb(34, 211, 238), rgb(139, 92, 246));
          cursor: pointer;
          box-shadow: 0 0 15px rgba(34, 211, 238, 0.5);
          border: 2px solid white;
        }

        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgb(34, 211, 238), rgb(139, 92, 246));
          cursor: pointer;
          box-shadow: 0 0 15px rgba(34, 211, 238, 0.5);
          border: 2px solid white;
        }
      `}</style>
    </motion.div>
  );
}
