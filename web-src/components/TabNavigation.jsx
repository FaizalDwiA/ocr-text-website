import React from 'react';
import { Image, Camera } from 'lucide-react';

export function TabNavigation({ activeTab, onSelectTab }) {
  return (
    <div id="tab-nav-card" className="bg-slate-900/80 p-2 border border-slate-850 rounded-2xl shadow-lg flex gap-2">
      <button
        type="button"
        id="tab-btn-upload"
        onClick={() => onSelectTab('upload')}
        className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
          activeTab === 'upload'
            ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/10'
            : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
        }`}
      >
        <Image className="w-4 h-4" />
        <span>Unggah Gambar / Dokumen</span>
      </button>

      <button
        type="button"
        id="tab-btn-camera"
        onClick={() => onSelectTab('camera')}
        className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
          activeTab === 'camera'
            ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/10'
            : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
        }`}
      >
        <Camera className="w-4 h-4" />
        <span>Gunakan Kamera Langsung</span>
      </button>
    </div>
  );
}
