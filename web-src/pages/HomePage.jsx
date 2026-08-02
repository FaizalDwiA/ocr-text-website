import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { FeatureCard } from '../components/FeatureCard';

const features = [
  {
    icon: '🖼️',
    title: 'Ekstraksi Teks OCR',
    description:
      'Unggah gambar (JPG, PNG, WEBP) lalu AI akan mengekstrak semua teks yang terdeteksi secara otomatis. Mendukung cropping area dan berbagai bahasa.',
    tags: ['Upload Gambar', 'Drag & Drop', 'Multi-bahasa'],
    to: '/ocr',
    accentColor: 'indigo',
  },
  {
    icon: '📷',
    title: 'Kamera Langsung',
    description:
      'Bidik dokumen fisik, papan tulis, atau teks apapun langsung dari kamera perangkat Anda. Ambil snapshot lalu ekstrak teks secara instan.',
    tags: ['Live Camera', 'Snapshot', 'Flip Kamera'],
    to: '/camera',
    accentColor: 'violet',
  },
  {
    icon: '🎵',
    title: 'Transkripsi File',
    description:
      'Transkripsi otomatis dari berkas audio atau video (MP3, WAV, MP4, dll). Putar file sambil menghasilkan transkripsi secara real-time.',
    tags: ['Upload Audio/Video', 'Media Player', 'Lokal'],
    to: '/speech-file',
    accentColor: 'sky',
  },
  {
    icon: '🎙️',
    title: 'Perekaman Suara',
    description:
      'Transkripsikan suara Anda secara langsung melalui mikrofon perangkat. Cocok untuk mencatat percakapan atau dikte langsung.',
    tags: ['Live Microphone', 'Real-time', 'Voice Note'],
    to: '/speech-mic',
    accentColor: 'indigo',
  },
];

export function HomePage() {
  return (
    <div className="bg-slate-950 text-slate-200 min-h-screen font-sans antialiased selection:bg-indigo-500 selection:text-white cosmic-mesh flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <section id="hero-section" className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 text-xs font-semibold text-indigo-300 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
            Powered by Tesseract.js &amp; Web Speech API
          </div>

          <h1 id="hero-title" className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight mb-4">
            Semua Fitur{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-sky-400 bg-clip-text text-transparent">
              OCR &amp; Speech
            </span>{' '}
            dalam Satu Tempat
          </h1>

          <p id="hero-subtitle" className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Ekstrak teks dari gambar, kamera langsung, transkripsi audio/video, hingga perekaman suara mikrofon langsung.
          </p>
        </section>

        {/* Feature Cards Grid */}
        <section id="features-grid" aria-label="Daftar fitur">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <FeatureCard key={f.to} {...f} />
            ))}
          </div>
        </section>

        {/* Privacy note */}
        <div className="mt-12 text-center">
          <p className="text-xs text-slate-600">
            🔒 Semua pemrosesan dilakukan lokal di browser Anda — tidak ada data yang dikirim ke server.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
