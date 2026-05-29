import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

export default function RecommendationCard({ recommendation, cost }) {
  const colorMap = {
    green: {
      bg: 'bg-emerald-900/40',
      border: 'border-emerald-500/50',
      text: 'text-emerald-300',
      icon: CheckCircle,
      gradient: 'from-emerald-500 to-cyan-500',
    },
    yellow: {
      bg: 'bg-yellow-900/40',
      border: 'border-yellow-500/50',
      text: 'text-yellow-300',
      icon: AlertTriangle,
      gradient: 'from-yellow-500 to-amber-500',
    },
    red: {
      bg: 'bg-red-900/40',
      border: 'border-red-500/50',
      text: 'text-red-300',
      icon: AlertCircle,
      gradient: 'from-red-500 to-pink-500',
    },
    cyan: {
      bg: 'bg-cyan-900/40',
      border: 'border-cyan-500/50',
      text: 'text-cyan-300',
      icon: CheckCircle,
      gradient: 'from-cyan-500 to-blue-500',
    },
  };

  const config = colorMap[recommendation.color] || colorMap.cyan;
  const Icon = config.icon;

  const messages = {
    expensive: {
      title: '⚠️ Too Expensive',
      description: 'This meeting has a high cost relative to its agenda clarity.',
      advice: 'Consider: Can this be handled async? Reduce participants? Shorten the meeting?',
    },
    optimize: {
      title: '🤔 Consider Optimizing',
      description: 'The meeting cost is moderate but could be improved.',
      advice: 'Try shortening the duration or removing less critical participants.',
    },
    worth: {
      title: `✓ ${recommendation.label}`,
      description: 'This meeting has a clear agenda and reasonable cost.',
      advice: 'This meeting is an efficient use of company time.',
    },
  };

  const message = messages[recommendation.type] || messages.worth;

  return (
    <motion.div
      className={`relative group ${config.bg} backdrop-blur-xl border ${config.border} rounded-2xl p-6 shadow-2xl overflow-hidden`}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: 0.5,
        type: 'spring',
        stiffness: 100,
      }}
    >
      {/* Animated gradient border glow */}
      <motion.div
        className={`absolute -inset-0.5 bg-gradient-to-r ${config.gradient} rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500`}
        animate={{
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Icon className={`w-6 h-6 ${config.text}`} />
          </motion.div>
          <div>
            <h3 className={`text-lg font-bold ${config.text}`}>
              {message.title}
            </h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-300 text-sm mb-4">
          {message.description}
        </p>

        {/* Cost breakdown */}
        <div className="bg-slate-800/40 rounded-lg p-3 mb-4 border border-slate-700/30">
          <p className="text-xs text-gray-400 mb-2">Meeting Investment:</p>
          <p className={`text-xl font-bold ${config.text}`}>
            Rs {cost.toFixed(2)}
          </p>
        </div>

        {/* Advice */}
        <motion.div
          className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-xs font-semibold text-gray-400 mb-1">💡 Insight:</p>
          <p className="text-sm text-gray-300">
            {message.advice}
          </p>
        </motion.div>

        {/* Action badge */}
        <motion.div
          className={`mt-4 inline-block px-3 py-1 rounded-full text-xs font-semibold ${
            recommendation.color === 'red'
              ? 'bg-red-500/20 text-red-300'
              : recommendation.color === 'yellow'
              ? 'bg-yellow-500/20 text-yellow-300'
              : 'bg-emerald-500/20 text-emerald-300'
          }`}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {recommendation.color === 'red' && '❌ Reconsider'}
          {recommendation.color === 'yellow' && '⚡ Optimize'}
          {recommendation.color === 'green' && '✅ Go Ahead'}
          {recommendation.color === 'cyan' && '✓ Scheduled'}
        </motion.div>
      </div>
    </motion.div>
  );
}
