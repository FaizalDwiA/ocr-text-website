import React from 'react';
import { Loader2 } from 'lucide-react';

export function ProgressTracker({ isProcessing, progressPercent, progressState }) {
  if (!isProcessing) return null;

  return (
    <div id="progress-card" className="bg-slate-900/70 rounded-2xl p-6 border border-indigo-900/60 shadow-lg space-y-4">
      <div className="flex items-center justify-between text-xs font-bold">
        <span id="progress-state" className="text-indigo-400 flex items-center gap-1.5">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>{progressState}</span>
        </span>
        <span id="progress-percent" className="text-indigo-400 bg-indigo-950/50 border border-indigo-900 px-2 py-0.5 rounded-full">
          {progressPercent}%
        </span>
      </div>

      <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
        <div
          id="progress-bar"
          className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-150 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
