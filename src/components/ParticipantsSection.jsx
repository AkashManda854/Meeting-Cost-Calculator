import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, User } from 'lucide-react';

export default function ParticipantsSection({
  participants,
  newParticipant,
  setNewParticipant,
  onAdd,
  onRemove,
}) {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onAdd();
    }
  };

  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      {/* Glowing border effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-violet-500 to-emerald-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>

      <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-lg">
            <User className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Participants</h2>
        </div>

        {/* Add Participant Form */}
        <div className="mb-6 p-4 bg-slate-800/50 rounded-xl border border-slate-700/30">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <input
              type="text"
              placeholder="Name (e.g., Alice Johnson)"
              value={newParticipant.name}
              onChange={(e) =>
                setNewParticipant({ ...newParticipant, name: e.target.value })
              }
              onKeyPress={handleKeyPress}
              className="px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition"
            />
            <input
              type="number"
              placeholder="Hourly rate (Rs)"
              value={newParticipant.cost}
              onChange={(e) =>
                setNewParticipant({ ...newParticipant, cost: e.target.value })
              }
              onKeyPress={handleKeyPress}
              step="0.01"
              min="0"
              className="px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition"
            />
          </div>

          <motion.button
            onClick={onAdd}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            Add Person
          </motion.button>
        </div>

        {/* Participants List */}
        <div className="space-y-3">
          <AnimatePresence>
            {participants.length === 0 ? (
              <motion.p
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center text-gray-400 py-8"
              >
                No participants added yet
              </motion.p>
            ) : (
              participants.map((participant) => {
                const cost = (participant.cost * 0.5); // Assuming 30 min default, will be dynamic
                return (
                  <motion.div
                    key={participant.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center justify-between p-4 bg-slate-800/40 border border-slate-700/30 rounded-lg hover:bg-slate-800/60 hover:border-cyan-500/50 transition group"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-white">{participant.name}</p>
                      <p className="text-sm text-gray-400">
                        Rs {participant.cost.toFixed(2)}/hr
                      </p>
                    </div>

                    <motion.button
                      onClick={() => onRemove(participant.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-lg transition"
                    >
                      <Trash2 className="w-5 h-5" />
                    </motion.button>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>

        {/* Participant Count */}
        {participants.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 pt-4 border-t border-slate-700/30 text-center text-sm text-gray-400"
          >
            <span className="text-cyan-400 font-semibold">{participants.length}</span> participant
            {participants.length !== 1 ? 's' : ''}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
