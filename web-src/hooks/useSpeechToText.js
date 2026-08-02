import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * Custom Hook: useSpeechToText
 * Transkripsi suara ke teks 100% client-side berbasis Web Speech API.
 * Mendukung pemutaran audio/video dan perekaman mikrofon langsung.
 */
export function useSpeechToText() {
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptText, setTranscriptText] = useState('');
  const [interimText, setInterimText] = useState('');
  const [speechLanguage, setSpeechLanguage] = useState('id-ID'); // 'id-ID' | 'en-US' | 'ja-JP' | 'zh-CN'
  const [speechError, setSpeechError] = useState(null);

  const recognitionRef = useRef(null);
  const mediaRef = useRef(null);

  // Inisialisasi Web Speech Recognition API
  const getRecognitionInstance = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      throw new Error('Web Speech API tidak didukung di browser ini. Harap gunakan Google Chrome, Microsoft Edge, atau Safari.');
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = speechLanguage;
    return recognition;
  }, [speechLanguage]);

  const stopTranscribing = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Safe catch if already stopped
      }
      recognitionRef.current = null;
    }
    if (mediaRef.current && !mediaRef.current.paused) {
      mediaRef.current.pause();
    }
    setIsTranscribing(false);
    setInterimText('');
  }, []);

  const startTranscribing = useCallback(async (mediaElement = null) => {
    setSpeechError(null);
    stopTranscribing();

    try {
      const recognition = getRecognitionInstance();
      recognitionRef.current = recognition;
      mediaRef.current = mediaElement;

      recognition.onstart = () => {
        setIsTranscribing(true);
        if (mediaElement) {
          mediaElement.currentTime = 0;
          mediaElement.play().catch((err) => {
            console.warn('Media play prevented:', err);
          });
        }
      };

      recognition.onresult = (event) => {
        let finalChunk = '';
        let currentInterim = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalChunk += transcript + ' ';
          } else {
            currentInterim += transcript;
          }
        }

        if (finalChunk) {
          setTranscriptText((prev) => (prev ? `${prev}\n${finalChunk.trim()}` : finalChunk.trim()));
        }
        setInterimText(currentInterim);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setSpeechError('Izin mikrofon/audio ditolak. Harap izinkan akses di peramban web.');
        } else if (event.error !== 'no-speech') {
          setSpeechError(`Error Speech API: ${event.error}`);
        }
      };

      recognition.onend = () => {
        // Auto restart if still supposed to be transcribing media
        if (mediaElement && !mediaElement.paused && !mediaElement.ended) {
          try {
            recognition.start();
            return;
          } catch (e) {
            // Safe fallback
          }
        }
        setIsTranscribing(false);
        setInterimText('');
      };

      recognition.start();
    } catch (err) {
      console.error('Failed to start Speech-to-Text:', err);
      setSpeechError(err.message || 'Gagal memulai pemrosesan Speech-to-Text.');
      setIsTranscribing(false);
    }
  }, [getRecognitionInstance, stopTranscribing]);

  const clearTranscript = useCallback(() => {
    setTranscriptText('');
    setInterimText('');
    setSpeechError(null);
  }, []);

  useEffect(() => {
    return () => {
      stopTranscribing();
    };
  }, [stopTranscribing]);

  return {
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
  };
}
