import './App.css'

import { useState } from "react";
import type { Video } from "./types";
import { VideoPage } from './components/VideoPage';
import { VideoGrid } from './components/VideoGrid';

export default function App() {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  return (
    <div>
      <div className="app-header"><h1>Haystack</h1></div>
      { selectedVideo ? 
        <VideoPage video={selectedVideo!} onBack={() => setSelectedVideo(null)} />
      : 
        <VideoGrid onVideoClick={setSelectedVideo} /> }
    </div>
  );
}