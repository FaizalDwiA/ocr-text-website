import React, { useState, useCallback } from 'react';
import { Terminal, FileText, Copy, FileDown, Trash2 } from 'lucide-react';

export function WorkspaceTerminal({ text, onTextChange, onClear }) {
  const [showCopyBadge, setShowCopyBadge] = useState(false);

  const handleCopy = useCallback(() => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setShowCopyBadge(true);
      setTimeout(() => setShowCopyBadge(false), 2500);
    }).catch(err => {
      console.error('Copy error:', err);
    });
  }, [text]);

  const handleDownload = useCallback(() => {
    if (!text) return;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'hasil_ekstraksi_ocr.txt';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }, [text]);

  const isEmpty = !text;

  return (
    <div id="workspace-card" className="bg-slate-900 rounded-2xl border border-slate-800 shadow-md space-y-0 flex flex-col min-h-[350px] overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-800/80 px-5 py-3.5 bg-slate-900/50">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          <Terminal className="w-4 h-4 text-emerald-400" />
          Terminal Hasil Ekstraksi
        </h3>
        {showCopyBadge && (
          <span id="copy-success-badge" className="text-[10px] bg-emerald-950/80 text-emerald-300 border border-emerald-900 font-bold tracking-wide px-2.5 py-0.5 rounded animate-fade-in">
            BERHASIL DISALIN!
          </span>
        )}
      </div>

      {isEmpty ? (
        <div id="workspace-empty" className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
          <div className="p-3 bg-slate-950 text-slate-500 rounded-full border border-slate-850">
            <FileText className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-300">Belum ada dokumen yang dipindai</p>
            <p className="text-[11px] text-slate-500 max-w-xs leading-relaxed">
              Selesaikan pemotongan bidang gambar, atur bahasa, lalu pilih tombol "Mulai Ekstraksi Teks" di atas.
            </p>
          </div>
        </div>
      ) : (
        <div id="workspace-content" className="flex-1 flex flex-col space-y-0">
          <textarea
            id="output-textarea"
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            placeholder="Hasil ekstraksi teks OCR akan tampil di sini..."
            className="w-full flex-1 p-5 bg-slate-950 font-mono text-sm leading-relaxed text-indigo-100 placeholder-slate-600 border-none outline-none focus:ring-0 min-h-[200px]"
            rows={10}
          />
          <div className="flex flex-wrap items-center gap-2 p-4 bg-slate-900/60 border-t border-slate-800">
            <button
              type="button"
              onClick={handleCopy}
              className="flex-1 min-w-[120px] inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-xs rounded-xl transition-all duration-150 gap-2 shadow-md shadow-indigo-500/10"
            >
              <Copy className="w-3.5 h-3.5" />
              Salin ke Clipboard
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="flex-1 min-w-[120px] inline-flex items-center justify-center px-4 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-200 font-semibold text-xs rounded-xl transition-all duration-150 gap-2 border border-slate-700"
            >
              <FileDown className="w-3.5 h-3.5" />
              Unduh File (.txt)
            </button>

            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center justify-center p-2.5 bg-slate-850 hover:bg-red-950/50 hover:text-red-400 hover:border-red-900 text-slate-400 rounded-xl transition-all duration-150 border border-slate-750"
              title="Bersihkan Semua"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
