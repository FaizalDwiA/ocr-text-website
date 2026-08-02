import React from 'react';

export function Footer() {
  const version = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '1.0.0';

  return (
    <footer id="app-footer" className="border-t border-slate-900 bg-slate-950 mt-16 py-8 text-center text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 space-y-1">
        <p className="font-medium text-slate-300">&copy; 2026 Agustus - Faizal Dwi Al Farizi</p>
        <p className="text-slate-500 font-mono text-[11px]">
          v<span id="app-version">{version}</span>
        </p>
      </div>
    </footer>
  );
}
