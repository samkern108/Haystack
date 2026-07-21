import { SYSTEM_VIDEO_LABELS, type VideoLabel } from "./labels";
import type { Action, State } from "../../state/state";
import type { Video } from "../../state/types";
import { getVideoLabelIcon } from "./icons";
import { TooltipTrigger } from "../ui/Tooltip";
import "../videos/VideoCard.css";
import "../ui/Tooltip.css"

interface LabelSelectorProps {
  video: Video;
  state: State;
  layout: "horizontal" | "vertical";
  dispatch: React.ActionDispatch<[action: Action]>;
}

export default function LabelSelector(props: LabelSelectorProps) {
  const videoState =
    props.state.creators?.[props.video.creatorId_yt]
      ?.videos?.[props.video.videoId_yt];

  const activeVideoLabelId = videoState?.videoLabelId ?? null;
  function handleVideoLabelClick(videoLabel: VideoLabel) {
    props.dispatch({
      type: "SET_VIDEO_LABEL",
      creatorId: props.video.creatorId_yt,
      videoId: props.video.videoId_yt,
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
    <div className={`label-buttons-container ${props.layout}`}>
      <div className={'label-tabs'}>
        {SYSTEM_VIDEO_LABELS.map((videoLabel) => renderLabel(videoLabel))}
      </div>
    </div>
  );
}