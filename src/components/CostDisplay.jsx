import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

export default function CostDisplay({ cost, participants, duration, isLive }) {
  const [displayCost, setDisplayCost] = useState(0);

  // Animated counter
  useEffect(() => {
    const duration_ms = isLive ? 100 : 600;
    const startTime = Date.now();
    const startValue = displayCost;
    const diff = cost - startValue;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration_ms, 1);
      setDisplayCost(startValue + diff * progress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [cost]);

  const formatDuration = (seconds) => {
    if (isLive) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    return `${duration} min`;
  };

  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.4, type: 'spring', stiffness: 100 }}
    >
      {/* Glowing background */}
      <motion.div
        className="absolute -inset-1 bg-gradient-to-r from-cyan-500/50 via-violet-500/50 to-emerald-500/50 rounded-2xl blur-lg"
        animate={{
          opacity: isLive ? [0.5, 1, 0.5] : [0.3, 0.6, 0.3],
          scale: [0.95, 1.05, 0.95],
        }}
        transition={{
          duration: isLive ? 1 : 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Secondary glow */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-600 via-violet-600 to-emerald-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" />

      <div className={`relative backdrop-blur-xl border rounded-2xl p-8 shadow-2xl overflow-hidden ${
        isLive
          ? 'bg-gradient-to-br from-red-900/50 via-red-900/40 to-slate-950 border-red-400/50'
          : 'bg-gradient-to-br from-slate-900/90 via-slate-900/95 to-slate-950 border-cyan-400/30'
      }`}>
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-violet-600 opacity-20 blur-3xl" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <div className={`p-2 rounded-lg ${
              isLive
                ? 'bg-gradient-to-r from-red-500 to-orange-500'
                : 'bg-gradient-to-r from-cyan-500 to-violet-500'
            }`}>
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-300">
              {isLive ? '🔴 LIVE Meeting Cost' : 'Total Cost'}
            </h3>
          </div>

          {/* Large cost display */}
          <motion.div
            className="mb-6"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{
              duration: isLive ? 0.1 : 0.5,
              repeat: cost !== displayCost ? Infinity : 0,
            }}
          >
            <div className="flex items-baseline gap-1">
              <span className={`text-6xl font-bold text-transparent bg-clip-text ${
                isLive
                  ? 'bg-gradient-to-r from-red-400 to-orange-400'
                  : 'bg-gradient-to-r from-cyan-400 via-violet-400 to-emerald-400'
              }`}>
                Rs {displayCost.toFixed(2)}
              </span>
              {isLive && (
                <motion.span
                  className="text-2xl text-red-400"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  💸
                </motion.span>
              )}
            </div>
          </motion.div>

          {/* Stats */}
          <div className="space-y-3 border-t border-slate-700/50 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Participants</span>
              <motion.span
                className="font-semibold text-cyan-400"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.3 }}
              >
                {participants}
              </motion.span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-400">{isLive ? 'Elapsed Time' : 'Duration'}</span>
              <span className={`font-semibold ${isLive ? 'text-orange-400 text-lg' : 'text-violet-400'}`}>
                {formatDuration(duration)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-400">Cost/Min</span>
              <span className="font-semibold text-emerald-400">Rs {duration > 0 ? (displayCost / (duration / 60)).toFixed(2) : '0.00'}</span>
            </div>
          </div>

          {/* Cost indicator */}
          {displayCost > 0 && (
            <motion.div
              className="mt-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="w-full bg-slate-700/50 rounded-full h-2 mb-2 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${
                    displayCost > 500
                      ? 'bg-red-500'
                      : displayCost > 200
                      ? 'bg-yellow-500'
                      : 'bg-emerald-500'
                  }`}
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min((displayCost / 1000) * 100, 100)}%`,
                  }}
                  transition={{ duration: 0.8 }}
                />
              </div>
              <p className="text-xs text-gray-400">
                {displayCost > 500
                  ? '🔴 High cost meeting'
                  : displayCost > 200
                  ? '🟡 Moderate cost'
                  : '🟢 Efficient meeting'}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
