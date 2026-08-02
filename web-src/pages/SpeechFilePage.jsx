import React, { useState, useCallback, useRef } from 'react';
import { Header } from '../components/Header';
import { AudioPlayerViewport } from '../components/AudioPlayerViewport';
import { SpeechConfigPanel } from '../components/SpeechConfigPanel';
import { WorkspaceTerminal } from '../components/WorkspaceTerminal';
import { Footer } from '../components/Footer';
import { useSpeechToText } from '../hooks/useSpeechToText';
import { Music, Video, FolderSearch } from 'lucide-react';

export function SpeechFilePage() {
  const [mediaData, setMediaData] = useState(null); // { file, url, type, name, size }
  const mediaRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const {
    isTranscribing,
    transcriptText,
    setTranscriptText,
    interimText,
    speechLanguage,
    setSpeechLanguage,
    speechError,
    startTranscribing,
    stopTranscribing,
    clearTranscript,
  } = useSpeechToText();

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
    setMediaData({
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

  const handleMediaRefReady = useCallback((ref) => {
    mediaRef.current = ref;
  }, []);

  const handleChangeMedia = useCallback(() => {
    if (mediaData?.url) {
      URL.revokeObjectURL(mediaData.url);
    }
    setMediaData(null);
    mediaRef.current = null;
    stopTranscribing();
  }, [mediaData, stopTranscribing]);

  const handleStartTranscribing = useCallback(() => {
    startTranscribing(mediaRef.current);
  }, [startTranscribing]);

  return (
    <div className="bg-slate-950 text-slate-200 min-h-screen font-sans antialiased selection:bg-indigo-500 selection:text-white cosmic-mesh flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h2 id="page-title-speech-file" className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="text-3xl">🎵</span>
            Transkripsi Berkas Audio &amp; Video
          </h2>
          <p className="text-sm text-slate-400 mt-1">Unggah berkas media lokal lalu hasilkan transkripsi teks secara otomatis.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* COLUMN 1: AUDIO/VIDEO VIEWPORT */}
          <section id="speech-file-column-source" className="lg:col-span-7 space-y-6">
            <div id="speech-file-viewport-card" className="bg-slate-900/50 rounded-2xl border border-slate-800/80 shadow-md overflow-hidden flex flex-col min-h-[400px] p-6 justify-center">
              {mediaData ? (
                <AudioPlayerViewport
                  mediaData={mediaData}
                  onMediaRefReady={handleMediaRefReady}
                  onChangeMedia={handleChangeMedia}
                />
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`flex flex-col justify-center items-center p-8 transition-all duration-200 cursor-pointer border-2 border-dashed rounded-xl min-h-[320px] ${
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
                      <p className="text-sm font-bold text-slate-200">Seret & lepas berkas audio atau video di sini</p>
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
              )}
            </div>
          </section>

          {/* COLUMN 2: CONFIG & TERMINAL */}
          <section id="speech-file-column-extract" className="lg:col-span-5 space-y-6">
            <SpeechConfigPanel
              speechLanguage={speechLanguage}
              onSpeechLanguageChange={setSpeechLanguage}
              isTranscribing={isTranscribing}
              onStartTranscribing={handleStartTranscribing}
              onStopTranscribing={stopTranscribing}
              isDisabled={!mediaData}
              speechError={speechError}
              interimText={interimText}
            />
            <WorkspaceTerminal
              text={transcriptText}
              onTextChange={setTranscriptText}
              onClear={clearTranscript}
            />
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
