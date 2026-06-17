import type { Video } from "../types";
import './CreatorRow.css'

interface VideoCardProps {
  video: Video;
  onClick: () => void;
}

export function VideoCard({
  video,
  onClick,
}: VideoCardProps) {
  return (
    <button
      className="video-card"
      onClick={onClick}
    >
      <img
        src={video.thumbnail}
        alt={video.title}
      />
      <p>{video.title}</p>
    </button>
  );
}