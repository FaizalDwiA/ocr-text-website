import React, { useEffect } from 'react';
import { RefreshCw, Aperture } from 'lucide-react';

export function CameraPanel({
  videoRef,
  isCameraActive,
  cameraError,
  onStartStream,
  onToggleFacingMode,
  onCapture,
}) {
  useEffect(() => {
    onStartStream();
  }, [onStartStream]);

  return (
    <div id="camera-panel" className="flex-1 p-6 flex flex-col items-center justify-center space-y-4">
      {cameraError ? (
        <div className="p-4 bg-red-950/40 border border-red-900 text-red-300 text-xs rounded-xl text-center max-w-md">
          {cameraError}
        </div>
      ) : (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-950 shadow-inner max-h-[400px] border border-slate-800">
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
          {isCameraActive && (
            <div className="absolute bottom-3 left-3 bg-red-600 text-white text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded flex items-center gap-1.5 animate-pulse">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-white"></span>
              LIVE CAMERA
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-center gap-3 w-full">
        <button
          type="button"
          onClick={onToggleFacingMode}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-200 font-semibold text-xs rounded-xl transition-all duration-200 border border-slate-700 gap-2 shadow-xs"
        >
          <RefreshCw className="w-4 h-4" />
          Ganti Kamera (Toggle Front/Back)
        </button>

        <button
          type="button"
          onClick={onCapture}
          className="inline-flex items-center justify-center px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs rounded-xl transition-all duration-200 shadow-lg shadow-indigo-600/10 gap-2"
        >
          <Aperture className="w-4 h-4" />
          Ambil Foto Dokumen
        </button>
      </div>
    </div>
  );
}
