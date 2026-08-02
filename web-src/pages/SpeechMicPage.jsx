import React from 'react';
import { Header } from '../components/Header';
import { SpeechConfigPanel } from '../components/SpeechConfigPanel';
import { WorkspaceTerminal } from '../components/WorkspaceTerminal';
import { Footer } from '../components/Footer';
import { useSpeechToText } from '../hooks/useSpeechToText';
import { Mic, Radio } from 'lucide-react';

export function SpeechMicPage() {
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

  const handleStartTranscribing = () => {
    startTranscribing(null); // Passing null runs in Live Mic mode
  };

  return (
    <div className="bg-slate-950 text-slate-200 min-h-screen font-sans antialiased selection:bg-indigo-500 selection:text-white cosmic-mesh flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h2 id="page-title-speech-mic" className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="text-3xl">🎙️</span>
            Perekaman Suara Langsung
          </h2>
          <p className="text-sm text-slate-400 mt-1">Transkripsikan ucapan atau catatan suara Anda secara langsung menggunakan mikrofon.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* COLUMN 1: MIC VIEWPORT */}
          <section id="speech-mic-column-source" className="lg:col-span-7 space-y-6">
            <div id="speech-mic-viewport-card" className="bg-slate-900/50 rounded-2xl border border-slate-800/80 shadow-md overflow-hidden flex flex-col min-h-[400px] p-8 justify-center items-center">
              
              <div className="relative flex flex-col items-center justify-center space-y-6 text-center max-w-md">
                
                {/* Glowing mic visualizer indicator */}
                <div className="relative">
                  {isTranscribing && (
                    <>
                      {/* Pulse rings */}
                      <span className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping scale-150 duration-1000"></span>
                      <span className="absolute inset-0 rounded-full bg-indigo-500/10 animate-ping scale-200 duration-1500 delay-300"></span>
                    </>
                  )}
                  
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isTranscribing 
                      ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-xl shadow-red-500/30'
                      : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20'
                  }`}>
                    <Mic className={`w-10 h-10 ${isTranscribing ? 'animate-pulse' : ''}`} />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-200">
                    {isTranscribing ? 'Mikrofon Sedang Aktif' : 'Siap Merekam'}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {isTranscribing 
                      ? 'Silakan berbicara dekat mikrofon Anda sekarang. Pengenalan suara sedang berjalan secara real-time.' 
                      : 'Gunakan tombol panel kanan untuk memulai perekaman dan transkripsi suara.'}
                  </p>
                </div>

                {isTranscribing && (
                  <div className="flex gap-1.5 justify-center items-center h-8">
                    <span className="w-1 bg-indigo-500 h-3 rounded-full animate-bounce delay-100"></span>
                    <span className="w-1 bg-indigo-500 h-6 rounded-full animate-bounce delay-200"></span>
                    <span className="w-1 bg-indigo-500 h-4 rounded-full animate-bounce delay-150"></span>
                    <span className="w-1 bg-indigo-500 h-7 rounded-full animate-bounce delay-300"></span>
                    <span className="w-1 bg-indigo-500 h-2 rounded-full animate-bounce delay-75"></span>
                  </div>
                )}
              </div>

            </div>
          </section>

          {/* COLUMN 2: CONFIG & TERMINAL */}
          <section id="speech-mic-column-extract" className="lg:col-span-5 space-y-6">
            <SpeechConfigPanel
              speechLanguage={speechLanguage}
              onSpeechLanguageChange={setSpeechLanguage}
              isTranscribing={isTranscribing}
              onStartTranscribing={handleStartTranscribing}
              onStopTranscribing={stopTranscribing}
              isDisabled={false}
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
