import React, { useRef, useState } from 'react';
import { CloudUpload, FolderSearch } from 'lucide-react';

export function UploadPanel({ onImageSelected }) {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file) => {
    if (!file.type.startsWith('image/')) {
      alert('Format berkas tidak valid. Harap pilih gambar biner (PNG, JPG, WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      onImageSelected(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      id="upload-panel"
      onClick={() => fileInputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex-1 flex flex-col justify-center items-center p-8 transition-all duration-200 cursor-pointer border-2 border-dashed m-4 rounded-xl ${
        isDragOver
          ? 'bg-indigo-500/10 border-indigo-500'
          : 'border-slate-800 hover:bg-slate-900/40'
      }`}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <div id="upload-prompt" className="text-center max-w-sm space-y-4">
        <div className="inline-flex p-4 bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20">
          <CloudUpload className="w-10 h-10" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-bold text-slate-200">Seret & lepas berkas di sini</p>
          <p class="text-xs text-slate-400">Mendukung format gambar PNG, JPEG, atau WebP</p>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-200 font-semibold text-xs rounded-lg transition-all duration-200 border border-slate-700 shadow-sm gap-2"
        >
          <FolderSearch className="w-3.5 h-3.5" />
          Pilih Gambar Manual
        </button>
      </div>
    </div>
  );
}
