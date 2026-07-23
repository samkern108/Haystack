import { useState } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import LabelSelector from "../labels/LabelSelector";
import type { Video } from "../../state/types";
import { type State, type Action } from "../../state/state";
import { useDelayedHover } from "../../utils/hoverlogic";
import { getCreatorById } from "../../utils/videohelpers";
import { SYSTEM_VIDEO_LABELS, type VideoLabel } from "../labels/labels";
import { CommentIcon, getVideoLabelIcon } from "../labels/icons";
import { CommentCard } from '../comments/CommentCard';
import '../creators/CreatorRow.css'
import "./VideoCard.css"
import "../labels/Labels.scss"

interface VideoCardProps {
  video: Video;
  state: State;
  displayCreator: boolean;
  dispatch: React.ActionDispatch<[action: Action]>;
}

export function VideoCard( props : VideoCardProps) {
  const hover = useDelayedHover(50, 15000000);
  const navigate = useNavigate();

  const videoState = props.state.creators?.[props.video.creatorId_yt]
  ?.videos?.[props.video.videoId_yt];

  const videoLabelId = videoState?.videoLabelId ?? null;
  const videoLabel = SYSTEM_VIDEO_LABELS.find((b) => b.id === videoLabelId);
  const hasComment = (videoState?.comment && videoState?.comment?.length > 0) as boolean;

  const [commentCardOpen, setCommentCardOpen] = useState(false);

  function openCommentCard() {
    setCommentCardOpen(true);
  }

  function closeCommentCard() {
    setCommentCardOpen(false);
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

function renderVideoLabel(videoLabel: VideoLabel, hasComment: boolean) {
  return (
    <div className="video-label-controls">
        <div className={`label-button`}
        style={{ backgroundColor: videoLabel.color }}>
            { getVideoLabelIcon(videoLabel.id) }
        </div>
        { hasComment && <div className="comment-button">{ <CommentIcon/> }</div>}
    </div>
  );
}

  function renderVideoCardPopover(props: VideoCardProps, navigate: NavigateFunction) {
  return(
    <div className="video-card-popover">

      <div className="video-label-controls">
        <LabelSelector video={props.video} state={props.state} dispatch={props.dispatch} layout={"vertical"} />
        <button className="comment-button" onClick={openCommentCard}> { <CommentIcon/> } </button>
      </div>
      <img className="thumbnail" src={props.video.thumbnail} onClick={() => navigate(`/video/${props.video.videoId_yt}`)} />

      <strong className="video-title">{props.video.title}</strong>
      {props.displayCreator ? renderCreatorRow(props) : <></>}
    </div>
  );
}

  return (
    <div
      className="video-card"
      style={{backgroundColor: `color-mix(in srgb, ${videoLabel?.color} 5%, #ede7d9)`,
    
      borderColor: `color-mix(in srgb, ${videoLabel?.color} 40%, transparent)`}}
      onPointerEnter={hover.onPointerEnter}
      onPointerLeave={hover.onPointerLeave}
    >

    <div className={hover.hovered ? "hidden" : ""}>
      <img className="thumbnail" src={props.video.thumbnail} />
      <p className="video-title">{props.video.title}</p>
      {props.displayCreator ? renderCreatorRow(props) : <></>}
    </div>

    { videoLabel && renderVideoLabel(videoLabel, hasComment) }
    { hover.hovered && renderVideoCardPopover(props, navigate) }

    {commentCardOpen && (
      <CommentCard video={props.video} dispatch={props.dispatch} onClose={closeCommentCard} comment={videoState?.comment}/>
    )}
    </div>
  );
}