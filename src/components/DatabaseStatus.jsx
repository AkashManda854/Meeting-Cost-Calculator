import React from 'react';
import { Database, AlertCircle, CheckCircle } from 'lucide-react';

export default function DatabaseStatus({ serverOnline, loading, error }) {
  return (
    <div className="fixed bottom-4 right-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm">
      {serverOnline ? (
        <>
          <CheckCircle className="w-4 h-4 text-green-400" />
          <span className="text-gray-300">
            {loading ? 'Syncing...' : 'Database Connected'}
          </span>
        </>
      ) : (
        <>
          <AlertCircle className="w-4 h-4 text-yellow-400" />
          <span className="text-gray-300">Using Local Storage</span>
        </>
      )}
      {error && (
        <span className="text-red-400 ml-2">Error: {error}</span>
      )}
    </div>
  );
}
