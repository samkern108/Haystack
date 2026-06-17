import type { Creator } from "../types";
import { VideoCard } from "./VideoCard";
import './CreatorRow.css'

interface CreatorRowProps {
  creator: Creator;
}

export function CreatorRow({ creator }: CreatorRowProps) {
  return (
    <section className="creator-row">
      <div className="creator-info">
        <img className="creator-avatar" src={creator.avatarURL} alt={creator.name} />
        <h2>{creator.name}</h2>
      </div>

      <div className="video-strip">
        {creator.videos.map((video) => (
          <VideoCard
            key={video.youtubeId}
            video={video}
          />
        ))}
      </div>
    </section>
  );
}