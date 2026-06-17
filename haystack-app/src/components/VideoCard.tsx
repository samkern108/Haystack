import type { Video } from "../types";
import './CreatorRow.css'

interface VideoCardProps {
  video: Video;
}

export function VideoCard({ video }: VideoCardProps) {
  return (
    <a
      href={video.url}
      target="_blank"
      rel="noreferrer"
      className="video-card"
    >
      <img src={video.thumbnail} alt={video.title} />
      <p>{video.title}</p>
    </a>
  );
}