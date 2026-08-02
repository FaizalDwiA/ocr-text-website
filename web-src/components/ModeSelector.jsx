import React from 'react';
import { ScanText, Mic } from 'lucide-react';

export function ModeSelector({ currentMode, onSelectMode }) {
  return (
    <div id="mode-selector-card" className="bg-slate-900/90 p-2 border border-slate-800 rounded-2xl shadow-xl flex gap-2 mb-6">
      <button
        type="button"
        onClick={() => onSelectMode('ocr')}
        className={`flex-1 py-3.5 px-4 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2.5 ${
          currentMode === 'ocr'
            ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20'
            : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
        }`}
      >
        <ScanText className="w-4 h-4" />
        <span>Ekstraksi Teks OCR (Gambar / Kamera)</span>
      </button>

      <button
        type="button"
        onClick={() => onSelectMode('speech')}
        className={`flex-1 py-3.5 px-4 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2.5 ${
          currentMode === 'speech'
            ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20'
            : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
        }`}
      >
        <Mic className="w-4 h-4" />
        <span>Speech to Text (Musik / Video / Mic)</span>
      </button>
    </div>
  );
}
