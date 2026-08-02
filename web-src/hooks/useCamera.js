import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * Custom Hook: useCamera
 * Mengelola stream kamera (getUserMedia), pergantian kamera depan/belakang, dan capture snapshot.
 */
export function useCamera() {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' | 'user'
  const [cameraError, setCameraError] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  }, []);

  const startStream = useCallback(async () => {
    stopStream();
    setCameraError(null);

    try {
      const constraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
    } catch (err) {
      console.error('Camera stream error:', err);
      setCameraError('Gagal mengakses kamera. Izinkan akses kamera atau pastikan berjalan di bawah HTTPS/localhost.');
      setIsCameraActive(false);
    }
  }, [facingMode, stopStream]);

  const toggleFacingMode = useCallback(() => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  }, []);

  const captureSnapshot = useCallback(() => {
    if (!videoRef.current || !streamRef.current) return null;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);

    stopStream();
    return dataUrl;
  }, [stopStream]);

  // Clean up stream when component unmounts
  useEffect(() => {
    return () => {
      stopStream();
    };
  }, [stopStream]);

  return {
    videoRef,
    isCameraActive,
    cameraError,
    facingMode,
    startStream,
    stopStream,
    toggleFacingMode,
    captureSnapshot,
  };
}
