import React, { useRef, useState } from 'react';
import { Music, Video, Mic, FolderSearch, FileAudio } from 'lucide-react';

export function AudioInputPanel({ onMediaSelected, onSelectMicMode, inputSource }) {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file) => {
    const isAudio = file.type.startsWith('audio/');
    const isVideo = file.type.startsWith('video/');

    if (!isAudio && !isVideo) {
      alert('Format berkas tidak valid. Harap pilih berkas Audio (MP3, WAV, M4A, OGG) atau Video (MP4, WEBM, MKV).');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    onMediaSelected({
      file,
      url: objectUrl,
      type: isAudio ? 'audio' : 'video',
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
    });
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
    <div className="space-y-4">
      {/* Input Source Buttons (Upload File vs Live Mic) */}
      <div className="bg-slate-900/80 p-2 border border-slate-850 rounded-2xl shadow-lg flex gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
            inputSource === 'file'
              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/10'
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <FileAudio className="w-4 h-4" />
          <span>Unggah Berkas Musik / Video</span>
        </button>

        <button
          type="button"
          onClick={onSelectMicMode}
          className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
            inputSource === 'mic'
              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/10'
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <Mic className="w-4 h-4" />
          <span>Mikrofon Langsung (Live Record)</span>
        </button>
      </div>

      {/* Drag and drop upload box */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex-1 flex flex-col justify-center items-center p-8 transition-all duration-200 cursor-pointer border-2 border-dashed rounded-xl min-h-[320px] ${
          isDragOver
            ? 'bg-indigo-500/10 border-indigo-500'
            : 'border-slate-800 hover:bg-slate-900/40'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="audio/*,video/*"
          className="hidden"
        />

        <div className="text-center max-w-sm space-y-4">
          <div className="inline-flex gap-2 p-4 bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20">
            <Music className="w-8 h-8" />
            <Video className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-200">Seret & lepas musik atau video di sini</p>
            <p className="text-xs text-slate-400">Mendukung format MP3, WAV, M4A, MP4, WEBM, MKV</p>
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
            Pilih Berkas Media
          </button>
        </div>
      </div>
    </div>
  );
}
