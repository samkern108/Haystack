import type { Video } from "../../state/types";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import VideoLabelsPopup from "../labels/LabelsPopup";
import type { State, Action } from "../../state/state";
import VideoLabelDisplay from "../labels/LabelDisplay";
import '../creators/CreatorRow.css'
import "./VideoCard.css"
import "../labels/Labels.css"

interface VideoCardProps {
  video: Video;
  state: State;
  dispatch: React.ActionDispatch<[action: Action]>;
}

export function VideoCard( props : VideoCardProps) {
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
      <img src={props.video.thumbnail} />
      <p>{props.video.title}</p>
    </div>

    <VideoLabelDisplay video={props.video} state={props.state} />

     {showPopover && (
        <div className="video-card-popover">
          <VideoLabelsPopup video={props.video} state={props.state} dispatch={props.dispatch} />
          <img src={props.video.thumbnail} onClick={() => navigate(`/video/${props.video.videoId_yt}`)} />
          <p>{props.video.title}</p>
        </div>
      )}
    </div>
  );
}