import React from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';

export default function Header({ isDarkMode, setIsDarkMode }) {
  return (
    <motion.div
      className="relative z-20 pt-16 pb-12 text-center w-full overflow-visible"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Theme Toggle Button */}
      <motion.button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className={`absolute top-8 right-8 p-3 rounded-lg transition-all duration-300 z-50 ${
          isDarkMode
            ? 'bg-slate-800/50 hover:bg-slate-700/50 text-yellow-400 border border-slate-700/50'
            : 'bg-blue-100/50 hover:bg-blue-200/50 text-blue-600 border border-blue-300/50'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isDarkMode ? (
          <Sun size={24} />
        ) : (
          <Moon size={24} />
        )}
      </motion.button>

      <motion.div
        className="inline-block mb-4"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        style={{ display: 'none' }}
      >
        <div className="text-6xl">💰</div>
      </motion.div>

      <motion.h1
        className={`text-5xl sm:text-6xl lg:text-7xl font-black mb-4 bg-clip-text text-transparent px-4 transition-colors duration-300 leading-tight tracking-tight ${
          isDarkMode
            ? 'bg-gradient-to-r from-cyan-400 via-violet-400 to-emerald-400'
            : 'bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600'
        }`}
        style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          textRendering: 'optimizeLegibility',
          lineHeight: '1.1',
          letterSpacing: '-0.02em',
          paintOrder: 'stroke fill',
          overflow: 'visible',
          display: 'inline-block',
          minWidth: 'fit-content',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        Meeting Cost Calculator
      </motion.h1>

      <motion.p
        className={`text-lg sm:text-xl max-w-3xl mx-auto transition-colors duration-300 px-4 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}
        style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          textRendering: 'optimizeLegibility',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        Know the real cost before scheduling a meeting
      </motion.p>
    </motion.div>
  );
}
