import React, { useRef, useEffect } from 'react';
import { Music, Video, RefreshCw } from 'lucide-react';

export function AudioPlayerViewport({ mediaData, onMediaRefReady, onChangeMedia }) {
  const mediaRef = useRef(null);

  useEffect(() => {
    if (mediaRef.current) {
      onMediaRefReady(mediaRef.current);
    }
  }, [mediaData, onMediaRefReady]);

  if (!mediaData) return null;

  return (
    <div id="audio-player-viewport" className="p-6 flex flex-col space-y-4">
      <div className="flex items-center justify-between bg-slate-900/80 p-3 rounded-xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-lg">
            {mediaData.type === 'video' ? <Video className="w-5 h-5" /> : <Music className="w-5 h-5" />}
          </div>
          <div>
            <p className="text-xs font-bold text-slate-200 truncate max-w-xs">{mediaData.name}</p>
            <p className="text-[11px] text-slate-400">{mediaData.size} • {mediaData.type.toUpperCase()}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onChangeMedia}
          className="inline-flex items-center px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700 gap-1.5 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Ganti Media
        </button>
      </div>

      <div className="w-full bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center p-4 border border-slate-800 min-h-[220px]">
        {mediaData.type === 'video' ? (
          <video
            ref={mediaRef}
            src={mediaData.url}
            controls
            playsInline
            className="w-full max-h-[300px] object-contain rounded-lg"
          />
        ) : (
          <div className="w-full flex flex-col items-center justify-center space-y-4 py-6">
            <div className="p-4 bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20 animate-pulse">
              <Music className="w-12 h-12" />
            </div>
            <audio ref={mediaRef} src={mediaData.url} controls className="w-full max-w-md" />
          </div>
        )}
      </div>
    </div>
  );
}
