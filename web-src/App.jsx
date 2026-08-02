import React, { useState, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { ModeSelector } from './components/ModeSelector';
import { TabNavigation } from './components/TabNavigation';
import { UploadPanel } from './components/UploadPanel';
import { CameraPanel } from './components/CameraPanel';
import { CropperPanel } from './components/CropperPanel';
import { ConfigPanel } from './components/ConfigPanel';
import { ProgressTracker } from './components/ProgressTracker';

import { AudioInputPanel } from './components/AudioInputPanel';
import { AudioPlayerViewport } from './components/AudioPlayerViewport';
import { SpeechConfigPanel } from './components/SpeechConfigPanel';

import { WorkspaceTerminal } from './components/WorkspaceTerminal';
import { TipsCard } from './components/TipsCard';
import { Footer } from './components/Footer';

import { useOcr } from './hooks/useOcr';
import { useCamera } from './hooks/useCamera';
import { useSpeechToText } from './hooks/useSpeechToText';

export function App() {
  const [appMode, setAppMode] = useState('ocr'); // 'ocr' | 'speech'

  // STATE OCR (Gambar/Kamera)
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'camera'
  const [selectedImage, setSelectedImage] = useState(null);
  const [ocrLanguage, setOcrLanguage] = useState('ind');
  const cropperRef = useRef(null);

  // STATE SPEECH TO TEXT (Musik/Video/Mic)
  const [speechInputSource, setSpeechInputSource] = useState('file'); // 'file' | 'mic'
  const [mediaData, setMediaData] = useState(null); // { file, url, type, name, size }
  const mediaRef = useRef(null);

  const {
    isProcessing,
    progressPercent,
    progressState,
    extractedText,
    setExtractedText,
    processImage,
    clearExtractedText,
  } = useOcr();

  const {
    videoRef,
    isCameraActive,
    cameraError,
    startStream,
    stopStream,
    toggleFacingMode,
    captureSnapshot,
  } = useCamera();

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

  // HANDLERS MODE OCH
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    if (tab === 'upload') {
      stopStream();
    }
  }, [stopStream]);

  const handleImageSelected = useCallback((dataUrl) => {
    setSelectedImage(dataUrl);
  }, []);

  const handleCapture = useCallback(() => {
    const snapshotUrl = captureSnapshot();
    if (snapshotUrl) {
      setSelectedImage(snapshotUrl);
    }
  }, [captureSnapshot]);

  const handleCropperReady = useCallback((instance) => {
    cropperRef.current = instance;
  }, []);

  const handleChangeImage = useCallback(() => {
    setSelectedImage(null);
    cropperRef.current = null;
  }, []);

  const handleTriggerOcr = useCallback(async () => {
    if (!cropperRef.current) return;
    try {
      const croppedCanvas = cropperRef.current.getCroppedCanvas();
      if (!croppedCanvas) {
        alert('Gagal mengambil area gambar terpotong. Harap coba lagi.');
        return;
      }
      const croppedDataUrl = croppedCanvas.toDataURL('image/png');
      const text = await processImage(croppedDataUrl, ocrLanguage);
      if (!text) {
        setExtractedText('(Pemberitahuan: AI tidak menemukan karakter teks tertulis di area potongan terpilih.)');
      }
    } catch (err) {
      setExtractedText(`GGL_ERR: Error ekstraksi OCR:\n${err.message}`);
    }
  }, [ocrLanguage, processImage, setExtractedText]);

  // HANDLERS SPEECH TO TEXT
  const handleMediaSelected = useCallback((media) => {
    setMediaData(media);
    setSpeechInputSource('file');
  }, []);

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

  const handleSelectMicMode = useCallback(() => {
    handleChangeMedia();
    setSpeechInputSource('mic');
  }, [handleChangeMedia]);

  const handleStartTranscribing = useCallback(() => {
    startTranscribing(speechInputSource === 'file' ? mediaRef.current : null);
  }, [speechInputSource, startTranscribing]);

  return (
    <div className="bg-slate-950 text-slate-200 min-h-screen font-sans antialiased selection:bg-indigo-500 selection:text-white cosmic-mesh">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ModeSelector currentMode={appMode} onSelectMode={setAppMode} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* COLUMN 1: MEDIA VIEWPORT (Gambar/Kamera OR Musik/Video/Mic) */}
          <section id="column-source" className="lg:col-span-7 space-y-6">
            {appMode === 'ocr' ? (
              <>
                <TabNavigation activeTab={activeTab} onSelectTab={handleTabChange} />

                <div id="viewport-card" className="bg-slate-900/50 rounded-2xl border border-slate-800/80 shadow-md overflow-hidden flex flex-col min-h-[400px]">
                  {selectedImage ? (
                    <CropperPanel
                      imageUrl={selectedImage}
                      onCropperReady={handleCropperReady}
                      onChangeImage={handleChangeImage}
                    />
                  ) : activeTab === 'upload' ? (
                    <UploadPanel onImageSelected={handleImageSelected} />
                  ) : (
                    <CameraPanel
                      videoRef={videoRef}
                      isCameraActive={isCameraActive}
                      cameraError={cameraError}
                      onStartStream={startStream}
                      onToggleFacingMode={toggleFacingMode}
                      onCapture={handleCapture}
                    />
                  )}
                </div>
              </>
            ) : (
              <div id="speech-viewport-card" className="bg-slate-900/50 rounded-2xl border border-slate-800/80 shadow-md overflow-hidden flex flex-col min-h-[400px] p-4">
                {mediaData ? (
                  <AudioPlayerViewport
                    mediaData={mediaData}
                    onMediaRefReady={handleMediaRefReady}
                    onChangeMedia={handleChangeMedia}
                  />
                ) : (
                  <AudioInputPanel
                    onMediaSelected={handleMediaSelected}
                    onSelectMicMode={handleSelectMicMode}
                    inputSource={speechInputSource}
                  />
                )}
              </div>
            )}

            <TipsCard />
          </section>

          {/* COLUMN 2: CONFIGURATION & TERMINAL WORKSPACE */}
          <section id="column-extract" className="lg:col-span-12 xl:col-span-5 space-y-6">
            {appMode === 'ocr' ? (
              <>
                <ConfigPanel
                  language={ocrLanguage}
                  onLanguageChange={setOcrLanguage}
                  onTriggerOcr={handleTriggerOcr}
                  isDisabled={!selectedImage}
                  isProcessing={isProcessing}
                />

                <ProgressTracker
                  isProcessing={isProcessing}
                  progressPercent={progressPercent}
                  progressState={progressState}
                />

                <WorkspaceTerminal
                  text={extractedText}
                  onTextChange={setExtractedText}
                  onClear={clearExtractedText}
                />
              </>
            ) : (
              <>
                <SpeechConfigPanel
                  speechLanguage={speechLanguage}
                  onSpeechLanguageChange={setSpeechLanguage}
                  isTranscribing={isTranscribing}
                  onStartTranscribing={handleStartTranscribing}
                  onStopTranscribing={stopTranscribing}
                  isDisabled={speechInputSource === 'file' && !mediaData}
                  speechError={speechError}
                  interimText={interimText}
                />

                <WorkspaceTerminal
                  text={transcriptText}
                  onTextChange={setTranscriptText}
                  onClear={clearTranscript}
                />
              </>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
