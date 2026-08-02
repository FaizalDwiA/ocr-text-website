import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { OcrPage } from './pages/OcrPage';
import { CameraPage } from './pages/CameraPage';
import { SpeechFilePage } from './pages/SpeechFilePage';
import { SpeechMicPage } from './pages/SpeechMicPage';

export function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ocr" element={<OcrPage />} />
        <Route path="/camera" element={<CameraPage />} />
        <Route path="/speech-file" element={<SpeechFilePage />} />
        <Route path="/speech-mic" element={<SpeechMicPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
