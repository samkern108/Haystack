import { useState } from "react";
import { Link, useNavigate, type NavigateFunction } from "react-router-dom";
import LabelSelector from "../labels/LabelSelector";
import type { Creator, Video, VideoTag } from "../../state/types";
import { type VideoState, type Action, type VideoFilterState } from "../../state/state";
import { useDelayedHover } from "../../utils/hoverlogic";
import { SYSTEM_VIDEO_LABELS, type VideoLabel } from "../labels/labels";
import { CommentIcon, getVideoLabelIcon } from "../labels/icons";
import { CommentCard } from '../comments/CommentCard';
import { TooltipTrigger } from "../ui/Tooltip";
import { AppRoutes } from "../nav/routes";
import '../creators/CreatorRow.css'
import "./VideoCard.css"
import './VideoTags.css'
import "../labels/Labels.scss"
import { VideoTags } from "./VideoTags";
import { CreatorAvatar } from "../creators/CreatorAvatar";

interface VideoCardProps {
  creator: Creator;
  video: Video;
  videoState: VideoState;
  videoFilterState: VideoFilterState;
  videoTags: VideoTag[];
  creatorTags: VideoTag[];
  displayCreator: boolean;
  dispatch: React.ActionDispatch<[action: Action]>;
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

  const tags = props.videoTags;
  const creatorTagExceptions = props.videoState.creatorTagExceptions ?? [];
  const appliedCreatorTags = props.creatorTags.filter((tag) => !creatorTagExceptions.includes(tag.name));

  function toggleCreatorTagException(tagName: string) {
    props.dispatch({
      type: "TOGGLE_CREATOR_TAG_EXCEPTION",
      creatorId: props.creator.ucid,
      videoId: props.video.video_id,
      tagName,
    });
  }

  function renderCreatorRow(props: VideoCardProps) {
    return (
      <Link
        className="video-creator"
        to={AppRoutes.creator(props.creator.ucid)}
      >
          <p>{'by'}</p>
          <CreatorAvatar url={props.creator.avatar.url} name={props.creator.name} />
          <p>{props.creator.name}</p>
      </Link>
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
          <img className="thumbnail" 
            src={props.video.thumbnail_url} 
            loading="lazy"/>

          <span className="video-duration"> {props.video.timecode} </span>
        </div>

        <strong className="video-title clamped">{props.video.title}</strong>
        {props.displayCreator ? renderCreatorRow(props) : <></>}

        <VideoTags videoId={props.video.video_id} tags={tags} dispatch={props.dispatch}/>
        {appliedCreatorTags.length > 0 && (
          <div className="video-card-creator-tags" role="group" aria-label="Creator tags">
            <span className="video-card-creator-tags-label">Creator tags</span>
            <div className="video-tags">
              {appliedCreatorTags.map((tag) => (
                <span key={tag.name} className="video-tag creator-tag-chip" style={{ backgroundColor: tag.color }}>
                  {tag.name}
                  <button
                    type="button"
                    className="creator-tag-exclude"
                    aria-label={`Exclude creator tag ${tag.name} from this video`}
                    title="Exclude from this video"
                    onClick={() => toggleCreatorTagException(tag.name)}
                  >×</button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="video-card"
      style={{backgroundColor: `color-mix(in srgb, ${videoLabel?.color} 5%, var(--color-video-card-background))`,
    
      borderColor: `color-mix(in srgb, ${videoLabel?.color} 40%, transparent)`}}
      onPointerEnter={hover.onPointerEnter}
      onPointerLeave={hover.onPointerLeave}
    >

    <div className={hover.hovered ? "hidden" : ""}>
      
      <div className="thumbnail-container">
        <img className="thumbnail" 
          src={props.video.thumbnail_url}
          loading="lazy" />

        <span className="video-duration"> {props.video.timecode} </span>
      </div>

      <p className="video-title clamped">{props.video.title}</p>
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
