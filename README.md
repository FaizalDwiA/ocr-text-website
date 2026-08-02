# Smart OCR Text Extractor (Image to Text)

Aplikasi ekstraktor teks berbasis web yang modern dan kuat, berfungsi 100% di sisi klien (client-side) di dalam browser Anda. Menggunakan mesin AI OCR (Optical Character Recognition) secara lokal tanpa data yang dikirim ke server eksternal, sehingga menjamin privasi penuh.

## Deskripsi & Manfaat Pengguna
Aplikasi ini dirancang untuk sangat membantu **pelajar, mahasiswa, guru, penulis, dan pekerja kantoran** untuk:
* **Menghemat Waktu:** Mengambil catatan slide presentasi, papan tulis, buku cetak, atau file dokumen PDF berupa gambar tanpa harus mengetik ulang secara manual.
* **Meningkatkan Produktivitas:** Mengonversi screenshot, struk belanja, kartu nama, atau dokumen fisik langsung menjadi teks digital yang siap diedit, disalin, atau disimpan hanya dalam hitungan detik.
* **Privasi Aman:** Seluruh pemrosesan teks dan gambar berjalan sepenuhnya secara lokal di komputer atau ponsel pintar Anda menggunakan CPU/GPU browser Anda.

## Fitur Utama
1. **Dua Metode Input Gambar:**
   - **Unggah & Seret (Drag-and-Drop):** Mendukung file PNG, JPEG, dan WebP dari perangkat lokal Anda.
   - **Kamera Langsung (Live Camera):** Menggunakan kamera smartphone atau webcam laptop secara langsung dengan fitur toggle beralih kamera depan/belakang untuk memotret dokumen fisik dengan resolusi tinggi.
2. **Interactive Image Cropper:**
   - Memotong dan memilih area teks tertentu sebelum melakukan scanning untuk menghindari teks background yang tidak relevan agar hasil ekstraksi lebih akurat.
3. **Advanced OCR Configuration:**
   - **Pilihan Bahasa Terpadu:** Pilihan bahasa deteksi dokumen (mendukung Bahasa Indonesia dan Bahasa Inggris) yang otomatis mengunduh berkas latih AI Tesseract.js secara dinamis.
   - **Pelacak Status Real-time (Progress Tracker):** Menampilkan pembaruan visual yang jelas saat menginisialisasi mesin AI, mengunduh data bahasa, dan proses pengenalan teks (0-100%).
4. **Workspace Hasil Ekstraksi:**
   - Teks yang berhasil diekstraksi ditampilkan di area teks yang dapat diedit langsung.
   - Dilengkapi fungsi instan seperti **Salin ke Clipboard (Copy)**, **Unduh Berkas .txt**, dan **Bersihkan Layar (Clear)**.

---

## Prasyarat Teknis
Pastikan Anda sudah menginstal:
* [Node.js](https://nodejs.org/) (versi 18 atau lebih baru direkomendasikan).
* npm (biasanya terbundel bersama instalasi Node.js).

## Panduan Instalasi
1. Kloning repositori ini atau ekstrak folder proyek.
2. Buka terminal/command prompt di direktori root aplikasi.
3. Jalankan perintah berikut untuk menginstal seluruh ketergantungan paket:
   ```bash
   npm install
   ```

---

## Perintah Pengembangan Lokal

### 1. Menjalankan Server Pengembangan (Dev Mode)
Untuk melihat aplikasi dan melakukan perubahan secara real-time di browser, jalankan:
```bash
npm run dev
```
Aplikasi akan tersedia secara default di `http://localhost:3000`.

### 2. Kompilasi Berkas Produksi (Production Build)
Untuk membangun dan mengompilasi seluruh aplikasi menjadi kode HTML, CSS, dan JS statis yang optimal untuk ditaruh di server ataupun GitHub Pages, jalankan:
```bash
npm run build
```
Proses ini akan meluncurkan pembersihan visual berkas lama di root dan membuat folder `assets/` serta file `index.html` langsung di root folder agar siap disajikan di GitHub Pages.

---

## Panduan Penyebaran ke GitHub Pages

Aplikasi ini dapat di-host secara gratis di GitHub Pages dengan sangat mudah:
1. Pastikan seluruh berkas hasil kompilasi produksi (seperti `index.html` di root, serta folder `assets/`) sudah terbentuk dan tidak masuk dalam daftar `.gitignore`.
2. Kirim (commit dan push) seluruh kode di direktori root ke repositori publik GitHub Anda.
3. Di halaman repositori GitHub Anda, navigasikan ke tab **Settings** -> **Pages**.
4. Di bagian "Build and deployment", buat pilihan sumber (source) dari: **Deploy from a branch**.
5. Pilih branch Anda (biasanya `main` atau `master`) dan folder `/ (root)`, lalu klik **Save**.
6. Dalam beberapa menit, repositori Anda akan aktif dan siap dikunjungi.

> ⚠️ **CATATAN PENTING (HTTPS/Keamanan):**
> Akses fitur kamera langsung (`getUserMedia`) di web modern **WAJIB** berjalan di bawah protokol aman **HTTPS** (kecuali `localhost` untuk pengembangan). GitHub Pages secara otomatis menyediakan HTTPS secara gratis, sehingga fitur kamera akan berfungsi dengan sempurna pada tautan produksi Anda.
