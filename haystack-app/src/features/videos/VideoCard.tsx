import { useNavigate } from "react-router-dom";
import LabelSelector from "../labels/LabelSelector";
import type { Video } from "../../state/types";
import { type State, type Action } from "../../state/state";
import { useDelayedHover } from "../../utils/hoverlogic";
import { getCreatorById } from "../../utils/videohelpers";
import { SYSTEM_VIDEO_LABELS, type VideoLabel } from "../labels/labels";
import { getVideoLabelIcon } from "../labels/icons";
import '../creators/CreatorRow.css'
import "./VideoCard.css"
import "../labels/Labels.scss"

interface VideoCardProps {
  video: Video;
  state: State;
  displayCreator: boolean;
  dispatch: React.ActionDispatch<[action: Action]>;
}

function renderCreatorRow(props: VideoCardProps) {
  const creator = getCreatorById(props.video.creatorId_yt);
  return (
    <a
      className="video-creator"
      href={`https://www.youtube.com/@${props.video.creatorId_yt}`}
      target="_blank"
      rel="noopener noreferrer"
    >
        <p>{'by'}</p>
        <img className="creator-avatar" src={creator.avatarURL} alt={creator.name} />   
        <p>{creator.name}</p>
    </a>
  );
}

function renderVideoLabel(videoLabel: VideoLabel) {
  return (
    <div className="label-buttons-container display">
        <div className={`label-button active display`}
        style={{ backgroundColor: videoLabel.color }}>
            { getVideoLabelIcon(videoLabel.id) }
        </div>
    </div>
  );
}

export function VideoCard( props : VideoCardProps) {
  const navigate = useNavigate();
  const hover = useDelayedHover(50, 150);

  const videoState = props.state.creators?.[props.video.creatorId_yt]
  ?.videos?.[props.video.videoId_yt];

  const videoLabelId = videoState?.videoLabelId ?? null;
  const videoLabel = SYSTEM_VIDEO_LABELS.find((b) => b.id === videoLabelId);

  return (
    <div
      className="video-card"
      style={{backgroundColor: `color-mix(in srgb, ${videoLabel?.color} 5%, #ede7d9)`,
    
      borderColor: `color-mix(in srgb, ${videoLabel?.color} 40%, transparent)`}}
      onPointerEnter={hover.onPointerEnter}
      onPointerLeave={hover.onPointerLeave}
    >
    <div>
      <img className="thumbnail" src={props.video.thumbnail} />
      <p className="video-title">{props.video.title}</p>
      {props.displayCreator ? renderCreatorRow(props) : <></>}
    </div>

    { videoLabel && renderVideoLabel(videoLabel) }

     {hover.hovered && (
        <div className="video-card-popover">
          <LabelSelector video={props.video} state={props.state} dispatch={props.dispatch} layout={"vertical"} />
          <img className="thumbnail" src={props.video.thumbnail} onClick={() => navigate(`/video/${props.video.videoId_yt}`)} />

          <strong className="video-title">{props.video.title}</strong>
          {props.displayCreator ? renderCreatorRow(props) : <></>}
        </div>
      )}
    </div>
  );
}