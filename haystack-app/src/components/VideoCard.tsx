import type { Video } from "../types";
import { useNavigate } from "react-router-dom";
import './CreatorRow.css'

interface VideoCardProps {
  video: Video;
}

export function VideoCard({ video } : VideoCardProps) {
  const navigate = useNavigate();

  return (
    <button
      className="video-card"
      onClick={() => navigate(`/video/${video.youtubeId}`)}
    >
      <img src={video.thumbnail} />
      <p>{video.title}</p>
    </button>
  );
}