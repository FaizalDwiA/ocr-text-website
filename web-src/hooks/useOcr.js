import { useState, useCallback } from 'react';

/**
 * Custom Hook: useOcr
 * Mengelola status ekstraksi AI OCR (Tesseract.js), indikator progres, dan hasil teks.
 */
export function useOcr() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressState, setProgressState] = useState('Menginisialisasi Engine...');
  const [extractedText, setExtractedText] = useState('');
  const [error, setError] = useState(null);

  const processImage = useCallback(async (imageDataUrl, language = 'ind') => {
    if (!imageDataUrl) return;

    setIsProcessing(true);
    setProgressPercent(0);
    setProgressState('Mengunduh & menginisialisasi model AI...');
    setError(null);

    try {
      if (!window.Tesseract) {
        throw new Error('Pustaka Tesseract.js belum siap. Silakan muat ulang halaman.');
      }

      const result = await window.Tesseract.recognize(imageDataUrl, language, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            const pct = Math.round((m.progress || 0) * 100);
            setProgressPercent(pct);
            setProgressState(`Mengekstrak teks... (${pct}%)`);
          } else if (m.status) {
            setProgressState(m.status);
          }
        },
      });

      const cleaned = (result.data.text || '').trim();
      setExtractedText(cleaned);
      return cleaned;
    } catch (err) {
      console.error('OCR Processing Error:', err);
      setError(err.message || 'Terjadi kesalahan saat memproses gambar.');
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const clearExtractedText = useCallback(() => {
    setExtractedText('');
    setError(null);
  }, []);

  return {
    isProcessing,
    progressPercent,
    progressState,
    extractedText,
    setExtractedText,
    error,
    processImage,
    clearExtractedText,
  };
}
