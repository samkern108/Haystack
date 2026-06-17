import type { Creator, Video } from "../types";
import { VideoCard } from "./VideoCard";
import './CreatorRow.css'

interface CreatorRowProps {
  creator: Creator;
  onVideoClick: (video: Video) => void;
}

export function CreatorRow({
  creator,
  onVideoClick,
}: CreatorRowProps) {
  return (
    <section className="creator-row">
      <div className="creator-info">
        <h2>{creator.name}</h2>
      </div>

      <div className="video-strip">
        {creator.videos.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            onClick={() => { onVideoClick(video); }}
          />
        ))}
      </div>
    </section>
  );
}