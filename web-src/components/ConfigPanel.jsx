import React from 'react';
import { Settings, ChevronDown, Scan } from 'lucide-react';

export function ConfigPanel({ language, onLanguageChange, onTriggerOcr, isDisabled, isProcessing }) {
  return (
    <div id="config-card" className="bg-slate-900/50 rounded-2xl p-6 border border-slate-850 space-y-5 shadow-lg">
      <h3 className="text-md font-bold text-white flex items-center gap-1.5">
        <Settings className="w-4 h-4 text-indigo-400" />
        Konfigurasi Mesin OCR
      </h3>

      <div className="space-y-2">
        <label htmlFor="ocr-language" className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
          Bahasa Dokumen Gambar
        </label>
        <div className="relative">
          <select
            id="ocr-language"
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            disabled={isProcessing}
            className="w-full pl-3 pr-10 py-3 bg-slate-950 hover:bg-slate-900 border border-slate-700/80 rounded-xl font-medium text-sm transition-all text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
          >
            <option value="ind">Bahasa Indonesia ('ind')</option>
            <option value="eng">Bahasa Inggris ('eng')</option>
            <option value="ind+eng">Kombinasi Indonesia + Inggris</option>
            <option value="jpa">Bahasa Jepang ('jpa')</option>
            <option value="zho_sim">Bahasa Cina Sederhana ('zho_sim')</option>
            <option value="ara">Bahasa Arab ('ara')</option>
          </select>
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        <p className="text-[11px] text-slate-500">
          Mesin akan mengunduh paket data latih bahasa yang sesuai langsung ke browser Anda secara otomatis.
        </p>
      </div>

      <button
        type="button"
        id="extract-trigger-btn"
        onClick={onTriggerOcr}
        disabled={isDisabled || isProcessing}
        className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/10 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 disabled:shadow-none disabled:cursor-not-allowed"
      >
        <Scan className="w-4 h-4" />
        Mulai Ekstraksi Teks (OCR)
      </button>
    </div>
  );
}
