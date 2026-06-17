import type { Creator } from "../types";
import { VideoCard } from "./VideoCard";
import './CreatorRow.css'

interface CreatorRowProps {
  creator: Creator;
}

export function CreatorRow({ creator }: CreatorRowProps) {
  return (
    <section className="creator-row">
      <div className='creator-info'>
        <h2>{creator.name}</h2>
      </div>

      <div className="video-strip">
        {creator.videos.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
          />
        ))}
      </div>
    </section>
  );
}