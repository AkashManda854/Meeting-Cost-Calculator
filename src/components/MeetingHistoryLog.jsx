import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Trash2 } from 'lucide-react';

export default function MeetingHistoryLog({ history, isDarkMode }) {
  if (history.length === 0) {
    return (
      <motion.div
        className={`p-6 rounded-lg backdrop-blur-xl border ${
          isDarkMode
            ? 'bg-slate-900/80 border-slate-700/50'
            : 'bg-white/80 border-gray-300/50'
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <FileText size={24} className="text-blue-400" />
          <h3 className="text-xl font-bold">Meeting History</h3>
        </div>
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Rate your meetings to see them appear here.
        </p>
      </motion.div>
    );
  }

  const totalCost = history.reduce((sum, meeting) => sum + meeting.cost, 0);
  const avgRating = (history.reduce((sum, m) => sum + m.rating, 0) / history.length).toFixed(1);

  return (
    <motion.div
      className={`p-6 rounded-lg backdrop-blur-xl border ${
        isDarkMode
          ? 'bg-slate-900/80 border-slate-700/50'
          : 'bg-white/80 border-gray-300/50'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-2 mb-6">
        <FileText size={24} className="text-blue-400" />
        <h3 className="text-xl font-bold">Meeting History & ROI</h3>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <motion.div
          className={`p-4 rounded-lg ${
            isDarkMode
              ? 'bg-blue-500/10 border border-blue-500/30'
              : 'bg-blue-100/50 border border-blue-300'
          }`}
        >
          <p className={`text-sm opacity-70 ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
            Total Meetings
          </p>
          <p className="text-3xl font-bold text-blue-400 mt-1">{history.length}</p>
        </motion.div>

        <motion.div
          className={`p-4 rounded-lg ${
            isDarkMode
              ? 'bg-red-500/10 border border-red-500/30'
              : 'bg-red-100/50 border border-red-300'
          }`}
        >
          <p className={`text-sm opacity-70 ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>
            Total Capital Spent
          </p>
          <p className="text-3xl font-bold text-red-400 mt-1">Rs {totalCost.toFixed(2)}</p>
        </motion.div>

        <motion.div
          className={`p-4 rounded-lg ${
            isDarkMode
              ? 'bg-green-500/10 border border-green-500/30'
              : 'bg-green-100/50 border border-green-300'
          }`}
        >
          <p className={`text-sm opacity-70 ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
            Avg. Value Rating
          </p>
          <p className="text-3xl font-bold text-green-400 mt-1">{avgRating}⭐</p>
        </motion.div>
      </div>

      {/* History List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {history.map((meeting, idx) => (
          <motion.div
            key={meeting.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`p-4 rounded-lg flex items-center justify-between border transition ${
              meeting.expensive
                ? isDarkMode
                  ? 'bg-red-500/10 border-red-500/30'
                  : 'bg-red-100/30 border-red-300'
                : isDarkMode
                ? 'bg-slate-800/50 border-slate-700/30 hover:border-slate-600/50'
                : 'bg-gray-100/50 border-gray-300/30 hover:border-gray-400/50'
            }`}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold">{meeting.name}</p>
                {meeting.expensive && (
                  <span className="text-xs px-2 py-1 bg-red-500/30 text-red-300 rounded-full font-bold">
                    🚨 TOO EXPENSIVE
                  </span>
                )}
              </div>
              <div className="flex gap-4 text-sm mt-1 opacity-70">
                <span>💰 Rs {meeting.cost.toFixed(2)}</span>
                <span>👥 {meeting.attendees} attendees</span>
                <span>⏱️ {meeting.duration}m</span>
                <span>📅 {meeting.date}</span>
              </div>
            </div>
            <div className="text-2xl ml-4 flex gap-2">
              <div>
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < (meeting.rating || 3) ? '' : 'opacity-30'}>
                    ⭐
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
