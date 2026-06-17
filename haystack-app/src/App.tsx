import './App.css'

import { useState } from "react";
import type { Video } from "./types";
import { VideoPage } from './components/VideoPage';
import { VideoGrid } from './components/VideoGrid';

export default function App() {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

    if (selectedVideo) {
    return (
      <VideoPage
        video={selectedVideo}
        onBack={() => setSelectedVideo(null)}
      />
    );
  }

  return (
    <VideoGrid
      onVideoClick={setSelectedVideo}
    />
  );
}