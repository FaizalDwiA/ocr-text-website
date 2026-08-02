import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Reusable feature card for the Home landing page.
 * Props:
 *   - icon: string (emoji or SVG element)
 *   - title: string
 *   - description: string
 *   - tags: string[]   — small badge labels
 *   - to: string       — route path (e.g. '/ocr')
 *   - accentColor: 'indigo' | 'violet' | 'sky'
 */
export function FeatureCard({ icon, title, description, tags = [], to, accentColor = 'indigo' }) {
  const accent = {
    indigo: {
      glow: 'hover:shadow-indigo-500/20',
      border: 'hover:border-indigo-500/50',
      iconBg: 'bg-indigo-500/10 group-hover:bg-indigo-500/20',
      iconText: 'text-indigo-400',
      badgeBg: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
      btn: 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/30',
      arrow: 'group-hover/btn:translate-x-1',
    },
    violet: {
      glow: 'hover:shadow-violet-500/20',
      border: 'hover:border-violet-500/50',
      iconBg: 'bg-violet-500/10 group-hover:bg-violet-500/20',
      iconText: 'text-violet-400',
      badgeBg: 'bg-violet-500/10 text-violet-300 border-violet-500/20',
      btn: 'bg-violet-600 hover:bg-violet-500 shadow-violet-500/30',
      arrow: 'group-hover/btn:translate-x-1',
    },
    sky: {
      glow: 'hover:shadow-sky-500/20',
      border: 'hover:border-sky-500/50',
      iconBg: 'bg-sky-500/10 group-hover:bg-sky-500/20',
      iconText: 'text-sky-400',
      badgeBg: 'bg-sky-500/10 text-sky-300 border-sky-500/20',
      btn: 'bg-sky-600 hover:bg-sky-500 shadow-sky-500/30',
      arrow: 'group-hover/btn:translate-x-1',
    },
  }[accentColor];

  return (
    <div
      className={`group relative flex flex-col bg-slate-900/70 backdrop-blur-sm border border-slate-800/80 rounded-2xl p-6 
        transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${accent.glow} ${accent.border}`}
    >
      {/* Icon */}
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-5 transition-colors duration-300 ${accent.iconBg} ${accent.iconText}`}>
        {icon}
      </div>

      {/* Title */}
      <h2 className="text-lg font-bold text-white mb-2 leading-snug">{title}</h2>

      {/* Description */}
      <p className="text-sm text-slate-400 leading-relaxed flex-1 mb-5">{description}</p>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag) => (
            <span
              key={tag}
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${accent.badgeBg}`}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* CTA Button */}
      <Link
        to={to}
        className={`group/btn inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold text-white 
          transition-all duration-200 shadow-lg ${accent.btn}`}
      >
        Buka Fitur
        <span className={`transition-transform duration-200 ${accent.arrow}`}>→</span>
      </Link>
    </div>
  );
}
