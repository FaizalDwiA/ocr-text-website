/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * CORE OCR ENGINE & CROPPING INTERFACE
 * Mengintegrasikan CropperJS (v1.x) dan Tesseract.js (v7.x) secara client-side.
 */

import Cropper from 'cropperjs';

/**
 * Menginisialisasi instansi CropperJS pada elemen gambar
 * @param {HTMLImageElement} imageElement 
 * @returns {Cropper|null} Instansi Cropper
 */
export function initCropperInstance(imageElement) {
  if (!imageElement) return null;
  
  // Mengembalikan objek Cropper baru dengan pengaturan seimbang untuk pemindaian gambar
  return new Cropper(imageElement, {
    viewMode: 1, // Melindungi kotak seleksi agar tidak melebihi area gambar
    dragMode: 'move', // Default kursor untuk memindahkan gambar
    autoCropArea: 0.85, // Membuka area seleksi crop awal sebesar 85%
    restore: false,
    guides: true, // Menampilkan kisi pandu garis tipis
    center: true,
    highlight: true,
    cropBoxMovable: true,
    cropBoxResizable: true,
    toggleDragModeOnDblclick: true,
    responsive: true,
    checkCrossOrigin: true,
    background: true, // Latar kotak-kotak transparan di belakang gambar
  });
}

/**
 * Mengekstrak area terpotong dari Cropper dalam bentuk Data URL (Base64 JPEG)
 * @param {Cropper} cropperInstance 
 * @returns {string|null} Base64 Data URL gambar terpotong
 */
export function getCroppedImageDataUrl(cropperInstance) {
  if (!cropperInstance) return null;
  
  // Ambil data canvas hasil crop dengan batas maksimal untuk menghidari lag pemrosesan OCR
  const canvas = cropperInstance.getCroppedCanvas({
    maxWidth: 2048,
    maxHeight: 2048,
    fillColor: '#ffffff', // Latar belakang putih sangat direkomendasikan untuk akurasi OCR
    imageSmoothingEnabled: true,
    imageSmoothingQuality: 'high'
  });
  
  return canvas ? canvas.toDataURL('image/jpeg', 0.95) : null;
}

/**
 * Mengekstrak teks dari gambar secara asinkron menggunakan AI Tesseract.js
 * @param {string} imageDataUrl - Base64 gambar target
 * @param {string} languageCode - Kode bahasa (misal 'ind' atau 'eng')
 * @param {Function} onProgressCallback - Callback untuk mengabari status kemajuan proses ke UI
 * @returns {Promise<string>} Teks hasil ekstraksi
 */
export async function extractTextFromImage(imageDataUrl, languageCode = 'ind', onProgressCallback) {
  let worker = null;
  
  try {
    // 1. Inisialisasi awal
    if (onProgressCallback) {
      onProgressCallback({
        status: 'initializing',
        progress: 0.05,
        message: 'Menginisialisasi mesin AI OCR...'
      });
    }

    const activeTesseract = window.Tesseract;
    if (!activeTesseract) {
      throw new Error("Pustaka Tesseract.js gagal termuat dari jaringan CDN terpercaya. Harap pastikan koneksi internet Anda aktif lalu muat ulang halaman.");
    }

    // Buat worker Tesseract dengan melampirkan pelacak log status.
    // Pada Tesseract.js v5+, parameter bahasa (langs) dan OCR Engine Mode (OEM) dikonfigurasikan di createWorker
    worker = await activeTesseract.createWorker(languageCode, 1, {
      langPath: 'https://cdn.jsdelivr.net/gh/naptha/tessdata@gh-pages/4.0.0_fast',
      logger: (log) => {
        if (!onProgressCallback) return;
        
        let displayMessage = 'Melakukan pemrosesan...';
        let calculatedProgress = 0.1;
        
        // Terjemahkan logs AI internal Tesseract.js menjadi pesan ramah pengguna berbahasa Indonesia
        switch (log.status) {
          case 'loading tesseract core':
            displayMessage = 'Memuat modul inti Tesseract AI...';
            calculatedProgress = 0.15;
            break;
          case 'loaded tesseract core':
            displayMessage = 'Modul inti tesseract berhasil dimuat.';
            calculatedProgress = 0.20;
            break;
          case 'initializing api':
            displayMessage = 'Mempersiapkan parameter API...';
            calculatedProgress = 0.25;
            break;
          case 'initialized api':
            displayMessage = 'API berhasil dikonfigurasi.';
            calculatedProgress = 0.30;
            break;
          case 'loading language traineddata':
            displayMessage = `Mengunduh kamus bahasa AI ('${languageCode}')...`;
            calculatedProgress = 0.35 + (log.progress || 0) * 0.30; // 35% - 65%
            break;
          case 'loaded language traineddata':
            displayMessage = 'Bahasa berhasil terunduh dan terpasang.';
            calculatedProgress = 0.65;
            break;
          case 'recognizing text':
            displayMessage = `Menganalisis & mengenali karakter teks: ${Math.round((log.progress || 0) * 100)}%`;
            calculatedProgress = 0.70 + (log.progress || 0) * 0.30; // 70% - 100%
            break;
        }
        
        onProgressCallback({
          status: log.status,
          progress: calculatedProgress,
          message: displayMessage
        });
      }
    });

    // 3. Eksekusi pengenalan pola teks
    const response = await worker.recognize(imageDataUrl);
    
    // Kembalikan teks mentah hasil ekstraksi
    return response.data.text || '';
    
  } catch (error) {
    console.error('OCR Error inside engine:', error);
    throw new Error(`Mesin gagal melakukan pembacaan: ${error.message}`);
  } finally {
    // PENTING: Matikan worker secara aman untuk menyembuhkan memori browser dari penumpukan kebocoran memori (memory leak)
    if (worker) {
      try {
        await worker.terminate();
        console.log('Tesseract Worker cleanly terminated.');
      } catch (termErr) {
        console.error('Error terminating worker:', termErr);
      }
    }
  }
}
