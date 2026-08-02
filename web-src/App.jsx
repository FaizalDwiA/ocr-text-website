import React, { useState, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { TabNavigation } from './components/TabNavigation';
import { UploadPanel } from './components/UploadPanel';
import { CameraPanel } from './components/CameraPanel';
import { CropperPanel } from './components/CropperPanel';
import { ConfigPanel } from './components/ConfigPanel';
import { ProgressTracker } from './components/ProgressTracker';
import { WorkspaceTerminal } from './components/WorkspaceTerminal';
import { TipsCard } from './components/TipsCard';
import { Footer } from './components/Footer';

import { useOcr } from './hooks/useOcr';
import { useCamera } from './hooks/useCamera';

export function App() {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'camera'
  const [selectedImage, setSelectedImage] = useState(null);
  const [language, setLanguage] = useState('ind');
  const cropperRef = useRef(null);

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
      const text = await processImage(croppedDataUrl, language);
      if (!text) {
        setExtractedText('(Pemberitahuan: Gambar berhasil diproses, namun AI tidak menemukan karakter teks di area terpilih. Coba ubah area potong atau bahasa.)');
      }
    } catch (err) {
      setExtractedText(`GGL_ERR: Terjadi kesalahan saat membaca dokumen.\nDetail: ${err.message}`);
    }
  }, [language, processImage, setExtractedText]);

  return (
    <div className="bg-slate-950 text-slate-200 min-h-screen font-sans antialiased selection:bg-indigo-500 selection:text-white cosmic-mesh">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* COLUMN 1: IMAGE SOURCES, CAMERA & CROPPER VIEWPORT */}
          <section id="column-source" className="lg:col-span-7 space-y-6">
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

            <TipsCard />
          </section>

          {/* COLUMN 2: OCR CONFIGURATION, PROGRESS TRACKER & OUTPUT AREA */}
          <section id="column-extract" className="lg:col-span-12 xl:col-span-5 space-y-6">
            <ConfigPanel
              language={language}
              onLanguageChange={setLanguage}
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
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
