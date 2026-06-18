import type { Video } from "../../types";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import '../creator_components/CreatorRow.css'
import "./VideoCard.css"

interface VideoCardProps {
  video: Video;
}

export function VideoCard({ video } : VideoCardProps) {
  const navigate = useNavigate();

    const [showPopover, setShowPopover] = useState(false);
    const mouseOverTimerRef = useRef<number | null>(null);
    const mouseLeaveTimerRef = useRef<number | null>(null);
    const popupWaitTime = 50;
  
    const handleMouseEnter = () => {
      mouseOverTimerRef.current = window.setTimeout(() => {
        setShowPopover(true);
      }, popupWaitTime);
  
      // This is to prevent the popover from showing if the user quickly hovers in and out of the creator info
      if (mouseLeaveTimerRef.current) {
        clearTimeout(mouseLeaveTimerRef.current);
      }
    };
  
    const handleMouseLeave = () => {
      // This is to prevent the popover from showing if the user quickly hovers in and out of the creator info
      if (mouseOverTimerRef.current) {
        clearTimeout(mouseOverTimerRef.current);
      }
  
      mouseLeaveTimerRef.current = window.setTimeout(() => {
        setShowPopover(false);
      }, popupWaitTime);
    };
    
  return (
    <div
      className="video-card"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
    <div>
      <img src={video.thumbnail} />
      <p>{video.title}</p>
    </div>

     {showPopover && (
        <div className="video-card-popover"
        onClick={() => navigate(`/video/${video.youtubeId}`)}
        >
        <img src={video.thumbnail} />
        <p>{video.title}</p>
        </div>
      )}
    </div>
  );
}