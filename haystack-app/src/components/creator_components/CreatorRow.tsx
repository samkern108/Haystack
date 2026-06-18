import type { Creator } from "../../types";
import { VideoCard } from "../video_components/VideoCard";
import './CreatorRow.css'
import '../video_components/VideoCard.css'
import { CreatorInfo } from "./CreatorInfo";

interface CreatorRowProps {
  creator: Creator;
}

export function CreatorRow({ creator }: CreatorRowProps) {
  return (
    <section className="creator-row">
      <CreatorInfo creator={creator} />

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