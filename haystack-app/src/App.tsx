import './App.css'

import { Routes, Route } from "react-router-dom";
import { VideoPage } from './components/VideoPage';
import { VideoGrid } from './components/VideoGrid';
import { AboutUsPage } from './components/AboutUsPage';
import { NavBar } from './components/NavBar';

export default function App() {
  return (
    <div>
      <NavBar></NavBar>

      <Routes>
        <Route path="/" element={<VideoGrid />} />
        <Route path="/video/:id" element={<VideoPage />} />
        <Route path="/about" element={<AboutUsPage />} />
      </Routes>
    </div>
  );
}