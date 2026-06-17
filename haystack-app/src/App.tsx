import './App.css'

import { Routes, Route } from "react-router-dom";
import { VideoPage } from './components/VideoPage';
import { VideoGrid } from './components/VideoGrid';

export default function App() {
  return (
    <div>
      <div className="app-header">
        <h1>Haystack</h1>
      </div>
      <Routes>
        <Route path="/" element={<VideoGrid />} />
        <Route path="/video/:id" element={<VideoPage />} />
      </Routes>
    </div>
  );
}