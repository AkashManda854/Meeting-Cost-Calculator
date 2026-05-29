import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Coffee, Zap } from 'lucide-react';

export default function ShockValueMetrics({ cost, isDarkMode }) {
  // Convert cost to relatable metrics
  const metrics = {
    saas: Math.round((cost / 30) * 10) / 10,
    coffee: Math.round((cost / 5) * 10) / 10,
    aws: Math.round((cost / 120) * 10) / 10,
  };

  return (
    <motion.div
      className={`p-6 rounded-lg backdrop-blur-xl border overflow-hidden ${
        isDarkMode
          ? 'bg-slate-900/80 border-slate-700/50'
          : 'bg-white/80 border-gray-300/50'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp size={24} className="text-emerald-400" />
        <h3 className="text-xl font-bold">Meeting Value in Context</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* SaaS Metric */}
        <motion.div
          className={`p-4 rounded-lg ${
            isDarkMode
              ? 'bg-cyan-500/10 border border-cyan-500/30'
              : 'bg-cyan-100/50 border border-cyan-300'
          }`}
          whileHover={{ scale: 1.05 }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className={`text-sm opacity-70 ${isDarkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
                Team SaaS Subscription
              </p>
              <p className="text-2xl font-bold text-cyan-400 mt-1">
                {metrics.saas}
              </p>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-cyan-200' : 'text-cyan-600'}`}>
                months of Slack/Tool cost
              </p>
            </div>
            <div className="text-3xl">💼</div>
          </div>
        </motion.div>

        {/* Coffee Metric */}
        <motion.div
          className={`p-4 rounded-lg ${
            isDarkMode
              ? 'bg-orange-500/10 border border-orange-500/30'
              : 'bg-orange-100/50 border border-orange-300'
          }`}
          whileHover={{ scale: 1.05 }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className={`text-sm opacity-70 ${isDarkMode ? 'text-orange-300' : 'text-orange-700'}`}>
                Premium Coffee
              </p>
              <p className="text-2xl font-bold text-orange-400 mt-1">
                {metrics.coffee}
              </p>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-orange-200' : 'text-orange-600'}`}>
                espresso shots equivalent
              </p>
            </div>
            <div className="text-3xl">☕</div>
          </div>
        </motion.div>

        {/* AWS Metric */}
        <motion.div
          className={`p-4 rounded-lg ${
            isDarkMode
              ? 'bg-violet-500/10 border border-violet-500/30'
              : 'bg-violet-100/50 border border-violet-300'
          }`}
          whileHover={{ scale: 1.05 }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className={`text-sm opacity-70 ${isDarkMode ? 'text-violet-300' : 'text-violet-700'}`}>
                AWS Cloud Hosting
              </p>
              <p className="text-2xl font-bold text-violet-400 mt-1">
                {metrics.aws}
              </p>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-violet-200' : 'text-violet-600'}`}>
                days of server costs
              </p>
            </div>
            <div className="text-3xl">⚡</div>
          </div>
        </motion.div>
      </div>

      <motion.div
        className={`mt-4 p-3 rounded-lg text-sm text-center font-semibold ${
          isDarkMode
            ? 'bg-slate-800 text-slate-300'
            : 'bg-gray-100 text-gray-700'
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        💡 Use these metrics to understand the real cost of your meetings
      </motion.div>
    </motion.div>
  );
}
