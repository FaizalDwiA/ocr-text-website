import React from 'react';
import { Mic, MicOff, ChevronDown, Radio } from 'lucide-react';

export function SpeechConfigPanel({
  speechLanguage,
  onSpeechLanguageChange,
  isTranscribing,
  onStartTranscribing,
  onStopTranscribing,
  isDisabled,
  speechError,
  interimText,
}) {
  return (
    <div id="speech-config-card" className="bg-slate-900/50 rounded-2xl p-6 border border-slate-850 space-y-5 shadow-lg">
      <h3 className="text-md font-bold text-white flex items-center gap-1.5">
        <Mic className="w-4 h-4 text-indigo-400" />
        Konfigurasi Speech-to-Text
      </h3>

      {speechError && (
        <div className="p-3.5 bg-red-950/50 border border-red-900 text-red-300 text-xs rounded-xl">
          {speechError}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="speech-language" className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
          Bahasa Audio / Suara
        </label>
        <div className="relative">
          <select
            id="speech-language"
            value={speechLanguage}
            onChange={(e) => onSpeechLanguageChange(e.target.value)}
            disabled={isTranscribing}
            className="w-full pl-3 pr-10 py-3 bg-slate-950 hover:bg-slate-900 border border-slate-700/80 rounded-xl font-medium text-sm transition-all text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
          >
            <option value="id-ID">Bahasa Indonesia ('id-ID')</option>
            <option value="en-US">Bahasa Inggris ('en-US')</option>
            <option value="ja-JP">Bahasa Jepang ('ja-JP')</option>
            <option value="zh-CN">Bahasa Mandarin ('zh-CN')</option>
          </select>
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        <p className="text-[11px] text-slate-500">
          Suara diproses 100% secara lokal oleh mesin pengenalan suara browser peramban web Anda.
        </p>
      </div>

      {isTranscribing && (
        <div className="p-3 bg-indigo-950/60 border border-indigo-800 rounded-xl space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-400">
            <Radio className="w-4 h-4 animate-pulse text-red-500" />
            <span>Mendengarkan & Mentranskripsikan...</span>
          </div>
          {interimText && (
            <p className="text-xs text-indigo-200/80 italic font-mono truncate">
              "{interimText}"
            </p>
          )}
        </div>
      )}

      {isTranscribing ? (
        <button
          type="button"
          onClick={onStopTranscribing}
          className="w-full py-4 px-6 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-red-600/20"
        >
          <MicOff className="w-4 h-4" />
          Hentikan Transkripsi
        </button>
      ) : (
        <button
          type="button"
          onClick={onStartTranscribing}
          disabled={isDisabled}
          className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/10 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 disabled:shadow-none disabled:cursor-not-allowed"
        >
          <Mic className="w-4 h-4" />
          Mulai Transkripsi Suara (Speech to Text)
        </button>
      )}
    </div>
  );
}
