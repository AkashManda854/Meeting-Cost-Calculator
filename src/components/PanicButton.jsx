import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

export default function PanicButton({ onStop, currentCost, isDarkMode }) {
  const [showModal, setShowModal] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);

  const emailTemplate = `Subject: Ending Meeting Early - Saving Rs ${currentCost.toFixed(2)}

Hi Team,

I've decided to end this meeting early as we've achieved our key objectives.

By ending ${Math.ceil(currentCost / 100)} minutes early, we're saving approximately Rs ${currentCost.toFixed(2)} in combined team time.

This freed-up time should be used to focus on high-impact tasks. Thanks for your understanding!

Best regards`;

  const handleCopy = () => {
    navigator.clipboard.writeText(emailTemplate);
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  };

  return (
    <>
      <motion.button
        onClick={() => setShowModal(true)}
        className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-all border-2 ${
          isDarkMode
            ? 'bg-red-500/20 border-red-500 text-red-300 hover:bg-red-500/30'
            : 'bg-red-100 border-red-400 text-red-700 hover:bg-red-200'
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        animate={{ boxShadow: [
          isDarkMode
            ? '0 0 20px rgba(239, 68, 68, 0.3)'
            : '0 0 20px rgba(239, 68, 68, 0.2)',
          isDarkMode
            ? '0 0 40px rgba(239, 68, 68, 0.5)'
            : '0 0 40px rgba(239, 68, 68, 0.4)',
        ]}}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        🛑 This Could Have Been an Email
      </motion.button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <motion.div
            className={`rounded-lg p-8 max-w-md w-full ${
              isDarkMode
                ? 'bg-slate-800 border border-red-500/30'
                : 'bg-white border border-red-300'
            }`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle size={32} className="text-red-500" />
              <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Meeting Aborted
              </h3>
            </div>

            <motion.div
              className={`p-4 rounded-lg mb-4 ${
                isDarkMode
                  ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                  : 'bg-green-100 text-green-700 border border-green-300'
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="font-bold">💰 Meeting Cost Saved:</p>
              <p className="text-3xl font-bold">Rs {currentCost.toFixed(2)}</p>
            </motion.div>

            <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Copy the pre-formatted email below to notify your team:
            </p>

            <textarea
              value={emailTemplate}
              readOnly
              className={`w-full p-3 rounded-lg mb-4 text-sm font-mono h-32 resize-none ${
                isDarkMode
                  ? 'bg-slate-700 text-gray-200 border border-slate-600'
                  : 'bg-gray-100 text-gray-800 border border-gray-300'
              }`}
            />

            <div className="flex gap-3">
              <motion.button
                onClick={handleCopy}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${
                  emailCopied
                    ? isDarkMode
                      ? 'bg-green-500/30 text-green-300'
                      : 'bg-green-200 text-green-700'
                    : isDarkMode
                    ? 'bg-cyan-500/30 text-cyan-300 hover:bg-cyan-500/40'
                    : 'bg-cyan-200 text-cyan-700 hover:bg-cyan-300'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                {emailCopied ? '✓ Copied!' : '📋 Copy Email'}
              </motion.button>
              <motion.button
                onClick={() => setShowModal(false)}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${
                  isDarkMode
                    ? 'bg-slate-700 hover:bg-slate-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                Done
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
