import React, { useState, useCallback, useRef } from 'react';
import { Header } from '../components/Header';
import { UploadPanel } from '../components/UploadPanel';
import { CropperPanel } from '../components/CropperPanel';
import { ConfigPanel } from '../components/ConfigPanel';
import { ProgressTracker } from '../components/ProgressTracker';
import { WorkspaceTerminal } from '../components/WorkspaceTerminal';
import { TipsCard } from '../components/TipsCard';
import { Footer } from '../components/Footer';
import { useOcr } from '../hooks/useOcr';

export function OcrPage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [ocrLanguage, setOcrLanguage] = useState('ind');
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

  const handleImageSelected = useCallback((dataUrl) => {
    setSelectedImage(dataUrl);
  }, []);

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

  return (
    <div className="bg-slate-950 text-slate-200 min-h-screen font-sans antialiased selection:bg-indigo-500 selection:text-white cosmic-mesh flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h2 id="page-title-ocr" className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="text-3xl">🖼️</span>
            Ekstraksi Teks OCR
          </h2>
          <p className="text-sm text-slate-400 mt-1">Unggah gambar dan ekstrak teks secara otomatis menggunakan AI lokal.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* COLUMN 1: IMAGE VIEWPORT */}
          <section id="ocr-column-source" className="lg:col-span-7 space-y-6">
            <div id="ocr-viewport-card" className="bg-slate-900/50 rounded-2xl border border-slate-800/80 shadow-md overflow-hidden flex flex-col min-h-[400px]">
              {selectedImage ? (
                <CropperPanel
                  imageUrl={selectedImage}
                  onCropperReady={handleCropperReady}
                  onChangeImage={handleChangeImage}
                />
              ) : (
                <UploadPanel onImageSelected={handleImageSelected} />
              )}
            </div>
            <TipsCard />
          </section>

          {/* COLUMN 2: CONFIG & TERMINAL */}
          <section id="ocr-column-extract" className="lg:col-span-5 space-y-6">
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
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
