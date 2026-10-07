import { SYSTEM_VIDEO_LABELS, type VideoLabel, type VideoLabelIdOrNone } from "./labels";
import type { Action, State, VideoState } from "../../state/state";
import type { Creator, Video } from "../../state/types";
import { getVideoLabelIcon } from "./icons";
import { TooltipTrigger } from "../ui/Tooltip";
import "../videos/VideoCard.css";
import "../ui/Tooltip.css"

interface LabelSelectorProps {
  creator: Creator;
  video: Video;
  videoState: VideoState;
  layout: "horizontal" | "vertical";
  dispatch: React.ActionDispatch<[action: Action]>;
}

export default function LabelSelector(props: LabelSelectorProps) {
  const activeVideoLabelId = props.videoState.videoLabelId ?? null;
  function handleVideoLabelClick(videoLabel: VideoLabel) {
    props.dispatch({
      type: "SET_VIDEO_LABEL",
      creatorId: props.creator.ucid,
      videoId: props.video.video_id,
      videoLabel: videoLabel,
    });
  }

  function renderLabel(videoLabel: VideoLabel) {
    return (
      <button
        key={videoLabel.id}
        type="button"
        className={`label-selector-button ${videoLabel.id} ${
          activeVideoLabelId === videoLabel.id ? "active" : ""
        }`}
        onClick={() => handleVideoLabelClick(videoLabel)}
      >
        <TooltipTrigger text={videoLabel.description}>
          { getVideoLabelIcon(videoLabel.id, "label-icon") }
        </TooltipTrigger>
      </button>
    )
  }

  return (
    <div className={`label-tabs ${props.layout}`}>
      {SYSTEM_VIDEO_LABELS.map((videoLabel) => renderLabel(videoLabel))}
    </div>
  );
}