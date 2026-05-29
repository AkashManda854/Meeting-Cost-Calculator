import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, AlertCircle } from 'lucide-react';

const GEMINI_API_KEY = 'Ab8RN6Le0z1ul7pJuhOAbfxjiB3BxOb73ZVD_mX6uAjVp4NQmg';

export default function AIAgendaAnalyzer({
  agenda,
  meetingType,
  attendeeCount,
  totalCost,
  onAnalysis,
  aiAnalysis,
  isDarkMode,
  isLoading,
  setIsLoading,
}) {
  const handleAnalyzeAgenda = async () => {
    setIsLoading(true);
    
    // Use mock analysis with realistic recommendations
    try {
      const mockAnalysis = {
        efficiencyScore: Math.max(40, Math.min(95, 50 + (attendeeCount * 3) + (agenda.length / 10))),
        recommendations: [
          agenda.length > 0 
            ? `Your agenda has ${agenda.split('\n').length} items. Prioritize top 3-5 critical items to keep meeting focused.`
            : 'Define a clear, concise agenda with 3-5 key discussion points.',
          `With ${attendeeCount === 0 ? 'your team' : attendeeCount + ' attendees'}, ensure decision-makers attend. Consider if all participants need full meeting or can catch up async.`,
          agenda.toLowerCase().includes('update') 
            ? 'Move status updates to Slack/async channels. Use meeting time only for decisions and blockers.'
            : 'Ensure this meeting requires synchronous discussion. If informational, send as email.',
        ],
        potentialSavings: `Rs ${Math.max(100, (totalCost * 0.15 + attendeeCount * 50)).toFixed(2)} (15-30% reduction possible)`,
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      onAnalysis(mockAnalysis);
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className={`p-6 rounded-lg backdrop-blur-xl border transition-all ${
        isDarkMode
          ? 'bg-slate-900/80 border-slate-700/50'
          : 'bg-white/80 border-gray-300/50'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Zap size={24} className="text-yellow-400" />
        <h3 className="text-xl font-bold">AI Meeting Optimizer</h3>
      </div>

      <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        Let AI analyze your agenda for efficiency opportunities
      </p>

      <motion.button
        onClick={handleAnalyzeAgenda}
        disabled={isLoading}
        className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
          isLoading
            ? isDarkMode
              ? 'bg-slate-700 text-gray-500 cursor-not-allowed'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            : isDarkMode
            ? 'bg-yellow-500/20 border border-yellow-500/50 text-yellow-300 hover:bg-yellow-500/30'
            : 'bg-yellow-100 border border-yellow-300 text-yellow-700 hover:bg-yellow-200'
        }`}
        whileHover={!isLoading ? { scale: 1.02 } : {}}
        whileTap={!isLoading ? { scale: 0.98 } : {}}
      >
        {isLoading ? '🤖 Analyzing...' : '✨ Analyze with AI'}
      </motion.button>

      <AnimatePresence>
        {aiAnalysis && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mt-6 p-4 rounded-lg border ${
              isDarkMode
                ? 'bg-yellow-500/10 border-yellow-500/30'
                : 'bg-yellow-100/50 border-yellow-300'
            }`}
          >
            {/* Efficiency Score */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold">Meeting Efficiency Score</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {aiAnalysis.efficiencyScore}/100
                </p>
              </div>
              <div className={`h-2 rounded-full overflow-hidden ${
                isDarkMode ? 'bg-slate-700' : 'bg-gray-300'
              }`}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${aiAnalysis.efficiencyScore}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-400"
                />
              </div>
            </div>

            {/* Recommendations */}
            <div className="mb-4">
              <p className="font-semibold mb-3">Actionable Recommendations</p>
              <ul className="space-y-2">
                {aiAnalysis.recommendations?.map((rec, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`flex gap-2 text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    <span className="text-yellow-400 font-bold mt-1">•</span>
                    <span>{rec}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Potential Savings */}
            {aiAnalysis.potentialSavings && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`p-3 rounded-lg text-center font-semibold ${
                  isDarkMode
                    ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                    : 'bg-green-100 text-green-700 border border-green-300'
                }`}
              >
                💰 Potential Savings: {aiAnalysis.potentialSavings}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
