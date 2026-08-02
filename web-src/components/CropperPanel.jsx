import React, { useEffect, useRef, useState, useCallback } from 'react';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import { ZoomIn, ZoomOut, RotateCcw, RotateCw, FlipHorizontal, Undo2, RefreshCw } from 'lucide-react';

export function CropperPanel({ imageUrl, onCropperReady, onChangeImage }) {
  const imgRef = useRef(null);
  const cropperRef = useRef(null);
  const [scaleX, setScaleX] = useState(1);

  useEffect(() => {
    if (!imgRef.current || !imageUrl) return;

    // Destroy existing cropper
    if (cropperRef.current) {
      cropperRef.current.destroy();
      cropperRef.current = null;
    }

    const cropper = new Cropper(imgRef.current, {
      viewMode: 1,
      dragMode: 'crop',
      initialAspectRatio: NaN,
      aspectRatio: NaN,
      autoCropArea: 0.9,
      restore: false,
      guides: true,
      center: true,
      highlight: true,
      cropBoxMovable: true,
      cropBoxResizable: true,
      toggleDragModeOnDblclick: true,
      responsive: true,
      background: false,
    });

    cropperRef.current = cropper;
    onCropperReady(cropper);

    return () => {
      if (cropperRef.current) {
        cropperRef.current.destroy();
        cropperRef.current = null;
      }
    };
  }, [imageUrl, onCropperReady]);

  const handleZoom = useCallback((delta) => {
    cropperRef.current?.zoom(delta);
  }, []);

  const handleRotate = useCallback((degree) => {
    cropperRef.current?.rotate(degree);
  }, []);

  const handleFlipH = useCallback(() => {
    if (cropperRef.current) {
      const nextScale = scaleX === 1 ? -1 : 1;
      setScaleX(nextScale);
      cropperRef.current.scaleX(nextScale);
    }
  }, [scaleX]);

  const handleReset = useCallback(() => {
    if (cropperRef.current) {
      cropperRef.current.reset();
      setScaleX(1);
    }
  }, []);

  return (
    <div id="cropper-panel" className="flex-1 p-6 flex flex-col space-y-4">
      <div className="w-full bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center min-h-[300px] border border-slate-800 relative">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
        <div className="max-w-full z-10">
          <img ref={imgRef} src={imageUrl} alt="Crop Workspace" className="block max-w-full h-auto" />
        </div>
      </div>

      <div id="cropper-toolbox" className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-slate-400 font-semibold">Atur batas kotak untuk memilih teks:</p>
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            title="Perbesar"
            onClick={() => handleZoom(0.1)}
            className="p-2 hover:bg-indigo-950/40 hover:text-indigo-400 text-slate-300 rounded-lg border border-slate-700 bg-slate-850 transition-all shadow-xs"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Perkecil"
            onClick={() => handleZoom(-0.1)}
            className="p-2 hover:bg-indigo-950/40 hover:text-indigo-400 text-slate-300 rounded-lg border border-slate-700 bg-slate-850 transition-all shadow-xs"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Putar Kiri"
            onClick={() => handleRotate(-90)}
            className="p-2 hover:bg-indigo-950/40 hover:text-indigo-400 text-slate-300 rounded-lg border border-slate-700 bg-slate-850 transition-all shadow-xs"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Putar Kanan"
            onClick={() => handleRotate(90)}
            className="p-2 hover:bg-indigo-950/40 hover:text-indigo-400 text-slate-300 rounded-lg border border-slate-700 bg-slate-850 transition-all shadow-xs"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Balik Horizontal"
            onClick={handleFlipH}
            className="p-2 hover:bg-indigo-950/40 hover:text-indigo-400 text-slate-300 rounded-lg border border-slate-700 bg-slate-850 transition-all shadow-xs"
          >
            <FlipHorizontal className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Batalkan Perubahan"
            onClick={handleReset}
            className="inline-flex items-center px-3 py-2 bg-slate-850 hover:bg-red-950/40 hover:text-red-400 text-slate-300 rounded-lg border border-slate-700 transition-all shadow-xs gap-1 text-xs font-semibold"
          >
            <Undo2 className="w-3.5 h-3.5" />
            Reset
          </button>
          <button
            type="button"
            title="Ubah Gambar"
            onClick={onChangeImage}
            className="inline-flex items-center px-3 py-2 bg-slate-850 hover:bg-indigo-950/40 hover:text-indigo-400 text-slate-300 rounded-lg border border-slate-700 transition-all shadow-xs gap-1 text-xs font-semibold"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Ganti
          </button>
        </div>
      </div>
    </div>
  );
}
