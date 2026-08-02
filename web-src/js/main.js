/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * MAIN APPLICATION INTERACTIVE DRIVER
 * Mengelola interaksi UI, aliran kamera, pembagian komponen, dan pemanggilan mesin OCR.
 */

import { initCropperInstance, getCroppedImageDataUrl, extractTextFromImage } from './ocrEngine.js';

// MENDEFINISIKAN KEADAAN GLOBAL (STATE) APLIKASI
let currentTab = 'upload';      // 'upload' | 'camera'
let cropperInstance = null;      // Menyimpan objek cropper aktif
let currentStream = null;        // Aliran stream video kamera aktif
let cameraFacingMode = 'environment'; // 'environment' (kamera belakang) | 'user' (kamera selfie)
let currentScaleX = 1;           // Status flip horizontal cropper

// REFERENSI ELEMEN-ELEMEN DOM UTAMA
const tabBtnUpload = document.getElementById('tab-btn-upload');
const tabBtnCamera = document.getElementById('tab-btn-camera');
const uploadPanel = document.getElementById('upload-panel');
const cameraPanel = document.getElementById('camera-panel');
const cropperPanel = document.getElementById('cropper-panel');

const imageFileInput = document.getElementById('image-file-input');
const browseBtn = document.getElementById('browse-btn');

const cameraPreview = document.getElementById('camera-preview');
const cameraToggleBtn = document.getElementById('camera-toggle-btn');
const cameraCaptureBtn = document.getElementById('camera-capture-btn');

const cropperImage = document.getElementById('cropper-image');
const cropZoomIn = document.getElementById('crop-zoom-in');
const cropZoomOut = document.getElementById('crop-zoom-out');
const cropRotateLeft = document.getElementById('crop-rotate-left');
const cropRotateRight = document.getElementById('crop-rotate-right');
const cropFlipH = document.getElementById('crop-flip-h');
const cropReset = document.getElementById('crop-reset');
const cropLoadNew = document.getElementById('crop-load-new');

const ocrLanguage = document.getElementById('ocr-language');
const extractTriggerBtn = document.getElementById('extract-trigger-btn');

const progressCard = document.getElementById('progress-card');
const progressState = document.getElementById('progress-state');
const progressPercent = document.getElementById('progress-percent');
const progressBar = document.getElementById('progress-bar');

const workspaceEmpty = document.getElementById('workspace-empty');
const workspaceContent = document.getElementById('workspace-content');
const outputTextarea = document.getElementById('output-textarea');

const copyAllBtn = document.getElementById('copy-all-btn');
const downloadTxtBtn = document.getElementById('download-txt-btn');
const clearAllBtn = document.getElementById('clear-all-btn');
const copySuccessBadge = document.getElementById('copy-success-badge');

// INISIALISASI APPLIKASI SISI KLIEN
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  
  // Set nomor versi secara dinamis dari package.json (via Vite define)
  const appVersionEl = document.getElementById('app-version');
  if (appVersionEl && typeof __APP_VERSION__ !== 'undefined') {
    appVersionEl.textContent = __APP_VERSION__;
  }

  // Jalankan render awal icons jika fungsi global tersedia
  if (window.lucide) {
    window.lucide.createIcons();
  }
});

/**
 * Menyambung dan mengonfigurasi seluruh pendengar aktivitas (Event Listeners)
 */
function setupEventListeners() {
  
  // 1. Tombol Navigasi Tab
  tabBtnUpload.addEventListener('click', () => switchTab('upload'));
  tabBtnCamera.addEventListener('click', () => switchTab('camera'));

  // 2. Drag & Drop Upload Handlers
  uploadPanel.addEventListener('click', () => imageFileInput.click());
  uploadPanel.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadPanel.classList.add('bg-indigo-50/20', 'border-indigo-500');
  });
  uploadPanel.addEventListener('dragleave', () => {
    uploadPanel.classList.remove('bg-indigo-50/20', 'border-indigo-500');
  });
  uploadPanel.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadPanel.classList.remove('bg-indigo-50/20', 'border-indigo-500');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  });

  // Tombol cari file manual
  if (browseBtn) {
    browseBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Mencegah bubbling click ke induk panel upload
      imageFileInput.click();
    });
  }

  // Pendengar perubahan input file gambar
  imageFileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      handleImageFile(e.target.files[0]);
    }
  });

  // 3. Tombol Kamera
  cameraToggleBtn.addEventListener('click', toggleCameraFacingMode);
  cameraCaptureBtn.addEventListener('click', captureSnapshot);

  // 4. Piranti Lunak Pengontrol Cropper (Toolbox Ops)
  cropZoomIn.addEventListener('click', () => cropperInstance && cropperInstance.zoom(0.1));
  cropZoomOut.addEventListener('click', () => cropperInstance && cropperInstance.zoom(-0.1));
  cropRotateLeft.addEventListener('click', () => cropperInstance && cropperInstance.rotate(-90));
  cropRotateRight.addEventListener('click', () => cropperInstance && cropperInstance.rotate(90));
  cropFlipH.addEventListener('click', () => {
    if (cropperInstance) {
      currentScaleX = currentScaleX === 1 ? -1 : 1;
      cropperInstance.scaleX(currentScaleX);
    }
  });
  cropReset.addEventListener('click', () => {
    if (cropperInstance) {
      cropperInstance.reset();
      currentScaleX = 1;
    }
  });
  cropLoadNew.addEventListener('click', () => {
    resetToInitialInputState();
  });

  // 5. Tombol Peluncur Utama OCR
  extractTriggerBtn.addEventListener('click', triggerOcrExtraction);

  // 6. Utilitas Workspace Hasil Akhir
  copyAllBtn.addEventListener('click', copyTextToClipboard);
  downloadTxtBtn.addEventListener('click', downloadTextFile);
  clearAllBtn.addEventListener('click', clearExtractionOutput);
}

/**
 * Berganti Tampilan Tab (Formulir Unggah vs Aliran Kamera Langsung)
 * @param {string} tabId 'upload' | 'camera'
 */
function switchTab(tabId) {
  if (currentTab === tabId) return;
  currentTab = tabId;

  // Visualisasi Tombol Tab Aktif
  if (tabId === 'upload') {
    tabBtnUpload.className = 'flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/10';
    tabBtnCamera.className = 'flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200';
    
    uploadPanel.classList.remove('hidden');
    cameraPanel.classList.add('hidden');
    cropperPanel.classList.add('hidden');
    stopCameraStream();
    
    // Matikan pemilih ekstrak jika belum memuat berkas gambar
    if (!cropperInstance) {
      extractTriggerBtn.disabled = true;
    } else {
      cropperPanel.classList.remove('hidden');
      uploadPanel.classList.add('hidden');
    }
  } else {
    tabBtnCamera.className = 'flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/10';
    tabBtnUpload.className = 'flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200';
    
    cameraPanel.classList.remove('hidden');
    uploadPanel.classList.add('hidden');
    cropperPanel.classList.add('hidden');
    
    // Jalankan stream kamera langsung
    startCameraStream();
    extractTriggerBtn.disabled = true;
  }
}

/**
 * Memuat berkas gambar biner lokal dan menyajikannya ke Interactive Cropper
 * @param {File} file Objek gambar terpilih
 */
function handleImageFile(file) {
  // Pastikan berkas terpilih adalah bertipe gambar
  if (!file.type.startsWith('image/')) {
    alert('Format berkas tidak valid. Harap pilih gambar biner (PNG, JPG, WebP).');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    initiateCropper(e.target.result);
  };
  reader.readAsDataURL(file);
}

/**
 * Mempersiapkan & mengaktifkan Aliran Kamera Perangkat (gUM)
 */
async function startCameraStream() {
  stopCameraStream(); // Hapus sisa stream lama jika ada
  
  try {
    const constraints = {
      video: {
        facingMode: { ideal: cameraFacingMode },
        width: { ideal: 1920 },
        height: { ideal: 1080 }
      },
      audio: false
    };
    
    currentStream = await navigator.mediaDevices.getUserMedia(constraints);
    cameraPreview.srcObject = currentStream;
  } catch (err) {
    console.error('Error starting video frame capture:', err);
    alert(
      'Kamera gagal aktif! ' + 
      '\n1. Izinkan akses izin kamera pada peramban web Anda.' +
      '\n2. Pastikan web dimuat di bawah protokol aman HTTPS jika bukan di localhost.'
    );
    // Kembalikan otomatis ke tab upload
    switchTab('upload');
  }
}

/**
 * Menghentikan pemakaian kamera agar hemat baterai/sumber daya sistem
 */
function stopCameraStream() {
  if (currentStream) {
    currentStream.getTracks().forEach(track => track.stop());
    currentStream = null;
    cameraPreview.srcObject = null;
  }
}

/**
 * Mengganti Arah Kamera Smartphone (Belakang vs Depan)
 */
function toggleCameraFacingMode() {
  cameraFacingMode = cameraFacingMode === 'environment' ? 'user' : 'environment';
  startCameraStream();
}

/**
 * Mengonversi video frame kamera menjadi gambar statis terpotong (Snapshot)
 */
function captureSnapshot() {
  if (!currentStream) return;

  const canvas = document.createElement('canvas');
  canvas.width = cameraPreview.videoWidth || 1280;
  canvas.height = cameraPreview.videoHeight || 720;
  
  const ctx = canvas.getContext('2d');
  
  // Ambil data visual dari kamera preview ke canvas 2D
  ctx.drawImage(cameraPreview, 0, 0, canvas.width, canvas.height);
  const snapshotDataUrl = canvas.toDataURL('image/jpeg', 0.95);
  
  // Matikan kamera langsung dan transisikan gambar hasil bidik kamera menuju cropper
  stopCameraStream();
  initiateCropper(snapshotDataUrl);
}

/**
 * Inisialisasi visualisasi Cropper dengan canvas gambar target
 * @param {string} base64ImageUrl Tautan base64 gambar target
 */
function initiateCropper(base64ImageUrl) {
  // Matikan objek cropper lama agar tidak bertubrukan memori
  if (cropperInstance) {
    cropperInstance.destroy();
    cropperInstance = null;
  }

  // Tampilkan panel cropper, matikan panel bunder lainnya
  cropperPanel.classList.remove('hidden');
  uploadPanel.classList.add('hidden');
  cameraPanel.classList.add('hidden');

  currentScaleX = 1;
  cropperImage.src = base64ImageUrl;

  // Lakukan penundaan inisialisasi agar browser melukis elemen gambar (layout)
  cropperImage.onload = () => {
    cropperInstance = initCropperInstance(cropperImage);
    extractTriggerBtn.disabled = false;
  };
}

/**
 * Menyetel ulang aplikasi ke keadaan awal
 */
function resetToInitialInputState() {
  if (cropperInstance) {
    cropperInstance.destroy();
    cropperInstance = null;
  }
  
  cropperImage.src = '';
  cropperPanel.classList.add('hidden');
  extractTriggerBtn.disabled = true;
  imageFileInput.value = '';

  if (currentTab === 'upload') {
    uploadPanel.classList.remove('hidden');
  } else {
    cameraPanel.classList.remove('hidden');
    startCameraStream();
  }
}

/**
 * Memulai pemrosesan AI OCR dari area gambar terpotong
 */
async function triggerOcrExtraction() {
  if (!cropperInstance) return;

  // 1. Dapatkan potret visual yang bersih (seleksi sub-bagian gambar)
  const croppedDataUrl = getCroppedImageDataUrl(cropperInstance);
  if (!croppedDataUrl) {
    alert('Gagal mengambil potongan gambar pelat teks. Harap muat ulang gambar.');
    return;
  }

  const selectedLanguage = ocrLanguage.value;

  // Amankan kendali visual UI
  extractTriggerBtn.disabled = true;
  progressCard.classList.remove('hidden');
  
  // Tampilkan antarmuka konten workspace, matikan ikon kosong
  workspaceEmpty.classList.add('hidden');
  workspaceContent.classList.remove('hidden');
  outputTextarea.placeholder = 'Sedang mengekstrak teks menggunakan kecerdasan AI lokal... Harap tunggu beberapa saat...';
  outputTextarea.value = '';

  try {
    // 2. Luncurkan pengenalan teks oleh model terlatih AI
    const resultText = await extractTextFromImage(
      croppedDataUrl, 
      selectedLanguage, 
      (progressEvent) => {
        // Melakukan pembaruan progres di bilah status UI
        const percentValue = Math.round(progressEvent.progress * 100);
        progressPercent.textContent = `${percentValue}%`;
        progressBar.style.width = `${percentValue}%`;
        progressState.innerHTML = `
          <i data-lucide="loader-2" class="w-3.5 h-3.5 animate-spin"></i>
          <span>${progressEvent.message}</span>
        `;
        if (window.lucide) {
          window.lucide.createIcons();
        }
      }
    );

    // 3. Salurkan output hasil akhir pembacaan ke teks area workspace
    const cleanedText = resultText.trim();
    if (cleanedText) {
      outputTextarea.value = cleanedText;
    } else {
      outputTextarea.value = '(Pemberitahuan: Gambar berhasil diproses secara penuh, namun AI tidak menemukan karakter teks tertulis di area potongan terpilih. Coba ubah area potong atau ganti bahasa.)';
    }

  } catch (error) {
    console.error('Failure of OCR processing:', error);
    outputTextarea.value = `GGL_ERR: Terjadi kesalahan saat membaca dokumen. Detail error:\n${error.message}\n\nSilakan coba lagi menggunakan parameter pemotongan yang lebih jelas.`;
  } finally {
    // Kembalikan utilitas pemicu tombol, sembunyikan bilah kemajuan
    extractTriggerBtn.disabled = false;
    progressCard.classList.add('hidden');
  }
}

/**
 * Menyalin teks dari textarea hasil ke Clipboard OS dengan pesan notifikasi instan
 */
function copyTextToClipboard() {
  const textVal = outputTextarea.value;
  if (!textVal) return;

  navigator.clipboard.writeText(textVal)
    .then(() => {
      copySuccessBadge.classList.remove('hidden');
      setTimeout(() => {
        copySuccessBadge.classList.add('hidden');
      }, 2500);
    })
    .catch((err) => {
      console.error('Failed to copy text:', err);
      alert('Gagal menyalin teks ke Papan Klip. Izinkan akses izin peramban web.');
    });
}

/**
 * Mengunduh isi teks ke dokumen teks (.txt) lokal
 */
function downloadTextFile() {
  const textVal = outputTextarea.value;
  if (!textVal) return;

  // Bungkus teks ke biner Blob UTF-8
  const blob = new Blob([textVal], { type: 'text/plain;charset=utf-8' });
  const downloadUrl = URL.createObjectURL(blob);
  
  // Buat element tautan hantu untuk memicu instalan unduh berkas
  const dummyAnchor = document.createElement('a');
  dummyAnchor.href = downloadUrl;
  dummyAnchor.download = 'hasil_ekstraksi_smart_ocr.txt';
  
  document.body.appendChild(dummyAnchor);
  dummyAnchor.click();
  
  // Lepas sisa sumber daya dari DOM
  document.body.removeChild(dummyAnchor);
  URL.revokeObjectURL(downloadUrl);
}

/**
 * Menghapus teks hasil analisis dan menampilkan kembali halaman awal yang kosong
 */
function clearExtractionOutput() {
  outputTextarea.value = '';
  workspaceContent.classList.add('hidden');
  workspaceEmpty.classList.remove('hidden');
}
