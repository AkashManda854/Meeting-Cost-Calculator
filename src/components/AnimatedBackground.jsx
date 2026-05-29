import React from 'react';
import { motion } from 'framer-motion';

export default function AnimatedBackground({ isDarkMode = true }) {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Main gradient background */}
      <div className={`absolute inset-0 transition-all duration-300 ${
        isDarkMode
          ? 'bg-gradient-to-br from-slate-950 via-purple-900 to-slate-900'
          : 'bg-gradient-to-br from-blue-50 via-slate-50 to-cyan-50'
      }`} />

      {/* Floating blob 1 */}
      <motion.div
        className={`absolute top-10 left-10 w-80 h-80 rounded-full blur-3xl transition-all duration-300 ${
          isDarkMode
            ? 'bg-gradient-to-br from-cyan-500/20 to-transparent'
            : 'bg-gradient-to-br from-blue-400/30 to-transparent'
        }`}
        animate={{
          x: [0, 50, -30, 0],
          y: [0, -50, 30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Floating blob 2 */}
      <motion.div
        className={`absolute top-1/4 right-20 w-96 h-96 rounded-full blur-3xl transition-all duration-300 ${
          isDarkMode
            ? 'bg-gradient-to-br from-violet-500/20 to-transparent'
            : 'bg-gradient-to-br from-purple-400/30 to-transparent'
        }`}
        animate={{
          x: [0, -60, 40, 0],
          y: [0, 60, -40, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />

      {/* Floating blob 3 */}
      <motion.div
        className={`absolute bottom-10 left-1/3 w-80 h-80 rounded-full blur-3xl transition-all duration-300 ${
          isDarkMode
            ? 'bg-gradient-to-br from-emerald-500/20 to-transparent'
            : 'bg-gradient-to-br from-cyan-400/30 to-transparent'
        }`}
        animate={{
          x: [0, 40, -50, 0],
          y: [0, -40, 60, 0],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 4,
        }}
      />

      {/* Floating blob 4 */}
      <motion.div
        className={`absolute bottom-20 right-10 w-72 h-72 rounded-full blur-3xl transition-all duration-300 ${
          isDarkMode
            ? 'bg-gradient-to-br from-pink-500/10 to-transparent'
            : 'bg-gradient-to-br from-blue-300/20 to-transparent'
        }`}
        animate={{
          x: [0, -40, 30, 0],
          y: [0, 50, -30, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />

      {/* Animated grid lines */}
      <div className={`absolute inset-0 ${isDarkMode ? 'opacity-5' : 'opacity-10'} transition-all duration-300`}>
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke={isDarkMode ? 'white' : 'black'} strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 transition-all duration-300" style={{
        background: isDarkMode
          ? 'radial-gradient(ellipse at center, transparent 0%, rgba(15, 23, 42, 0.8) 100%)'
          : 'radial-gradient(ellipse at center, transparent 0%, rgba(226, 232, 240, 0.6) 100%)'
      }} />
    </div>
  );
}
