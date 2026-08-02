import React from 'react';
import { Sparkles } from 'lucide-react';

export function TipsCard() {
  return (
    <div id="instruction-card" className="bg-indigo-950/20 rounded-2xl p-5 border border-indigo-950/80 flex gap-4 items-start">
      <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl">
        <Sparkles className="w-5 h-5" />
      </div>
      <div className="space-y-1">
        <h4 className="text-sm font-bold text-indigo-300">Tips Hasil Maksimal</h4>
        <p className="text-xs text-indigo-200/90 leading-relaxed">
          Posisikan teks secara tegak dan potong dengan pas hanya pada bidang paragraf atau kolom yang Anda butuhkan. Ini akan mencegah distorsi background dan meningkatkan kecepatan akurasi mesin AI OCR.
        </p>
      </div>
    </div>
  );
}
