import { useState } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import LabelSelector from "../labels/LabelSelector";
import type { Creator, Video } from "../../state/types";
import { type VideoState, type Action } from "../../state/state";
import { useDelayedHover } from "../../utils/hoverlogic";
import { SYSTEM_VIDEO_LABELS, type VideoLabel } from "../labels/labels";
import { CommentIcon, getVideoLabelIcon } from "../labels/icons";
import { CommentCard } from '../comments/CommentCard';
import { TooltipTrigger } from "../ui/Tooltip";
import { getChannelURL } from "../../utils/creatorhelpers";
import '../creators/CreatorRow.css'
import "./VideoCard.css"
import './VideoTags.css'
import "../labels/Labels.scss"

interface VideoCardProps {
  creator: Creator;
  video: Video;
  videoState: VideoState;
  displayCreator: boolean;
  dispatch: React.ActionDispatch<[action: Action]>;
}

interface VideoTag {
  id: string,
  name: string,
  color: string,
}

export function VideoCard( props : VideoCardProps) {
  const hover = useDelayedHover(60, 160);
  const navigate = useNavigate();

  const videoLabelId = props.videoState.videoLabelId ?? null;
  const videoLabel = SYSTEM_VIDEO_LABELS.find((b) => b.id === videoLabelId);
  const hasComment = (props.videoState.comment && props.videoState.comment?.length > 0) as boolean;

  const [commentCardOpen, setCommentCardOpen] = useState(false);

  function openCommentCard() {
    setCommentCardOpen(true);
  }

  function closeCommentCard() {
    setCommentCardOpen(false);
  }

  const tags = [
    {id: 'hi', name: 'games', color: '#000000'},
    {id: 'hi2', name: 'whatever', color: '#444488'},
    {id: 'hi3', name: 'World of Warcraft', color: '#0b4d23'},
    {id: 'hi3', name: 'Backrooms', color: '#4d0b1c'},];

  function renderCreatorRow(props: VideoCardProps) {
    return (
      <a
        className="video-creator"
        href={getChannelURL(props.creator.ucid)}
        target="_blank"
        rel="noopener noreferrer"
      >
          <p>{'by'}</p>
          <img className="creator-avatar" src={props.creator.avatar.url} alt={props.creator.name} />   
          <p>{props.creator.name}</p>
      </a>
    );
  }

  function renderVideoLabel(videoLabel: VideoLabel, hasComment: boolean) {
    return (
      <div className="video-labels-display">
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

        <div className="video-popover-controls">
          <LabelSelector creator={props.creator} video={props.video} videoState={props.videoState} dispatch={props.dispatch} layout={"horizontal"} />
        </div>

        <button className="comment-button" onClick={openCommentCard}> { <TooltipTrigger text="Leave a comment"><CommentIcon/></TooltipTrigger> } </button>

        <div className="thumbnail-container" onClick={() => navigate(`/v/${props.video.video_id}/c/${props.creator.ucid}`)} >
          <img className="thumbnail" src={props.video.thumbnail_url} />

          <span className="video-duration"> {props.video.timecode} </span>
        </div>

        <strong className="video-title">{props.video.title}</strong>
        {props.displayCreator ? renderCreatorRow(props) : <></>}

        <div className="video-tags">
          {tags.map((tag) => (
            <div
              key={tag.id}
              className="video-tag"
              style={{ backgroundColor: tag.color, }}
            >
              {tag.name}
            </div>
          ))}
        </div>
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
      
      <div className="thumbnail-container">
        <img className="thumbnail" src={props.video.thumbnail_url} />

        <span className="video-duration"> {props.video.timecode} </span>
      </div>

      <p className="video-title">{props.video.title}</p>
      {props.displayCreator ? renderCreatorRow(props) : <></>}
    </div>

    { videoLabel && renderVideoLabel(videoLabel, hasComment) }
    { hover.hovered && renderVideoCardPopover(props, navigate) }

    {commentCardOpen && (
      <CommentCard creatorId={props.creator.ucid} video={props.video} dispatch={props.dispatch} onClose={closeCommentCard} comment={props.videoState.comment}/>
    )}
    </div>
  );
}