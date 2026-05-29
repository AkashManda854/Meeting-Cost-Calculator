import React from 'react';
import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';

export default function AdvancedInputs({
  meetingType,
  setMeetingType,
  includeOverhead,
  setIncludeOverhead,
  includeOppCost,
  setIncludeOppCost,
  engagement,
  setEngagement,
  isDarkMode,
}) {
  const meetingTypes = [
    { value: 'decision', label: 'Decision Making', multiplier: '1.0x' },
    { value: 'standup', label: 'Status Update', multiplier: '0.5x' },
    { value: 'brainstorming', label: 'Brainstorming', multiplier: '0.8x' },
    { value: 'allhands', label: 'All Hands', multiplier: '0.7x' },
  ];

  return (
    <motion.div
      className={`p-6 rounded-lg backdrop-blur-xl border transition-all ${
        isDarkMode
          ? 'bg-slate-900/80 border-slate-700/50 text-white'
          : 'bg-white/80 border-gray-300/50 text-gray-900'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Settings size={24} className="text-cyan-400" />
        <h3 className="text-xl font-bold">Advanced Parameters</h3>
      </div>

      {/* Meeting Type */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-3">Meeting Type</label>
        <div className="grid grid-cols-2 gap-2">
          {meetingTypes.map(type => (
            <motion.button
              key={type.value}
              onClick={() => setMeetingType(type.value)}
              className={`py-3 px-4 rounded-lg text-sm font-semibold transition ${
                meetingType === type.value
                  ? isDarkMode
                    ? 'bg-cyan-500/30 border border-cyan-400 text-cyan-300'
                    : 'bg-cyan-100 border border-cyan-400 text-cyan-700'
                  : isDarkMode
                  ? 'bg-slate-800 border border-slate-600 hover:border-slate-500'
                  : 'bg-gray-100 border border-gray-300 hover:border-gray-400'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div>{type.label}</div>
              <div className="text-xs opacity-70">{type.multiplier}</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Overhead Costs */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-3">Hidden Overhead Costs</label>
        <div className="space-y-3">
          <motion.label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={includeOverhead}
              onChange={(e) => setIncludeOverhead(e.target.checked)}
              className="w-4 h-4 cursor-pointer"
            />
            <span className="text-sm">
              Include Prep & Wrap-up Time (15min prep + 10min per attendee)
            </span>
          </motion.label>
          <motion.label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={includeOppCost}
              onChange={(e) => setIncludeOppCost(e.target.checked)}
              className="w-4 h-4 cursor-pointer"
            />
            <span className="text-sm">
              Include Opportunity Cost (+15% productivity loss)
            </span>
          </motion.label>
        </div>
      </div>

      {/* Engagement Level */}
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-3">
          Engagement Level: {engagement}%
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={engagement}
          onChange={(e) => setEngagement(parseInt(e.target.value))}
          className="w-full h-2 bg-gradient-to-r from-red-500 to-green-500 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, rgb(239, 68, 68) 0%, rgb(34, 197, 94) ${engagement}%, ${
              isDarkMode ? 'rgb(30, 41, 59)' : 'rgb(229, 231, 235)'
            } ${engagement}%, rgb(34, 197, 94) 100%)`,
          }}
        />
        <div className="flex justify-between text-xs mt-2 opacity-70">
          <span>Low Engagement (Wasted)</span>
          <span>High Engagement (Productive)</span>
        </div>
      </div>

      {engagement < 50 && (
        <motion.div
          className={`p-3 rounded-lg text-sm ${
            isDarkMode
              ? 'bg-red-500/20 text-red-300 border border-red-500/30'
              : 'bg-red-100 text-red-700 border border-red-300'
          }`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          ⚠️ Low engagement detected. Consider making this meeting async or reducing attendees.
        </motion.div>
      )}
    </motion.div>
  );
}
