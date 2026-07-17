import type { Video } from "../../state/types";
import { useNavigate } from "react-router-dom";
import LabelSelector from "../labels/LabelSelector";
import type { State, Action } from "../../state/state";
import VideoLabelDisplay from "../labels/LabelDisplay";
import '../creators/CreatorRow.css'
import "./VideoCard.css"
import "../labels/Labels.scss"
import { useDelayedHover } from "../../utils/hoverlogic";

interface VideoCardProps {
  video: Video;
  state: State;
  dispatch: React.ActionDispatch<[action: Action]>;
}

export function VideoCard( props : VideoCardProps) {
  const navigate = useNavigate();
  const hover = useDelayedHover(50);
    
  return (
    <div
      className="video-card"
      onPointerEnter={hover.onPointerEnter}
      onPointerLeave={hover.onPointerLeave}
    >
    <div>
      <img src={props.video.thumbnail} />
      <p>{props.video.title}</p>
    </div>

    <VideoLabelDisplay video={props.video} state={props.state} />

     {hover.hovered && (
        <div className="video-card-popover">
          <LabelSelector video={props.video} state={props.state} dispatch={props.dispatch} />
          <img src={props.video.thumbnail} onClick={() => navigate(`/video/${props.video.videoId_yt}`)} />
          <strong>{props.video.title}</strong>
        </div>
      )}
    </div>
  );
}