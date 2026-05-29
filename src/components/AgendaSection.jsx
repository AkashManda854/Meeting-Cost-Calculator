import React from 'react';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

export default function AgendaSection({ agenda, setAgenda }) {
  const charCount = agenda.length;
  const maxChars = 50000;

  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {/* Glowing border effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500 via-emerald-500 to-cyan-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>

      <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-violet-500 to-emerald-500 rounded-lg">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Meeting Agenda</h2>
        </div>

        <div className="mb-4">
          <textarea
            value={agenda}
            onChange={(e) => setAgenda(e.target.value.substring(0, maxChars))}
            placeholder="Describe the purpose and expected outcomes... (e.g., 'Decide on Q2 product strategy and align on launch timeline')"
            maxLength={maxChars}
            className="w-full px-4 py-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition resize-none"
            rows="4"
          />
        </div>

        {/* Character counter */}
        <div className="flex justify-between items-center">
          <motion.div
            className="text-sm text-gray-400"
            animate={{ scale: charCount > maxChars * 0.8 ? 1.05 : 1 }}
          >
            <span className={charCount > maxChars * 0.8 ? 'text-yellow-400' : 'text-gray-400'}>
              {charCount}
            </span>
            <span className="text-gray-500">/{maxChars}</span>
          </motion.div>

          {/* Keywords indicator */}
          {agenda && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-xs"
            >
              {['decide', 'approve', 'urgent', 'critical'].some(kw =>
                agenda.toLowerCase().includes(kw)
              ) ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  ✓ Strong keywords detected
                </span>
              ) : ['update', 'status', 'fyi'].some(kw =>
                agenda.toLowerCase().includes(kw)
              ) ? (
                <span className="text-yellow-400 flex items-center gap-1">
                  ⚠ Weak keywords detected
                </span>
              ) : null}
            </motion.div>
          )}
        </div>

        {/* Agenda examples */}
        {!agenda && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 p-4 bg-slate-800/30 rounded-lg border border-slate-700/20"
          >
            <p className="text-xs font-semibold text-gray-400 mb-2">💡 Examples:</p>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>• "Decide on Q2 product roadmap"</li>
              <li>• "Approve new marketing strategy"</li>
              <li>• "Critical: System architecture review"</li>
            </ul>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
