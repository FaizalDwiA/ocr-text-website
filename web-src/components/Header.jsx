import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export function Header() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header id="app-header" className="border-b border-slate-900 bg-slate-950/50 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
        {/* Logo + Title */}
        <Link to="/" className="flex items-center gap-3 group">
          <div id="logo-icon-container" className="relative">
            <img
              src="./logo.svg"
              alt="OCR Text Logo"
              className="w-10 h-10 rounded-xl shadow-lg shadow-indigo-500/30 object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div>
            <h1 id="app-title" className="text-xl font-bold text-white tracking-tight">
              OCR <span className="text-indigo-500">Text</span>
            </h1>
            <p id="app-subtitle" className="text-xs text-slate-400 font-medium">Optical Character Recognition Text</p>
          </div>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Back to Home button — hanya tampil jika bukan di halaman utama */}
          {!isHome && (
            <Link
              to="/"
              id="btn-home"
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/90 hover:bg-slate-800 
                px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 transition-all duration-200"
            >
              <span>⌂</span>
              <span>Beranda</span>
            </Link>
          )}

          {/* Online indicator */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800 shadow-sm">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span id="network-status">Online</span>
          </div>
        </div>
      </div>
    </header>
  );
}
