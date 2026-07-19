import { SYSTEM_VIDEO_LABELS, type VideoLabel } from "./labels";
import type { Action, State } from "../../state/state";
import type { Video } from "../../state/types";
import { LoveIcon, StarIcon, XIcon } from "./icons";
import { TooltipTrigger } from "../ui/Tooltip";
import "../videos/VideoCard.css";
import "../ui/Tooltip.css"

interface LabelSelectorProps {
  video: Video;
  state: State;
  dispatch: React.ActionDispatch<[action: Action]>;
}

export default function LabelSelector(props: LabelSelectorProps) {
  const videoState =
    props.state.creators?.[props.video.creatorId_yt]
      ?.videos?.[props.video.videoId_yt];

  const activeVideoLabelId = videoState?.videoLabelId ?? null;

  const toggle = (videoLabel: VideoLabel) => {
    props.dispatch({
      type: "SET_VIDEO_LABEL",
      creatorId: props.video.creatorId_yt,
      videoId: props.video.videoId_yt,
      videoLabel: videoLabel,
    });
  };


  function handleColorChange(event: React.ChangeEvent<HTMLFieldSetElement>) {
    const selectedColor = event.target.id;
    const selectedLabel = SYSTEM_VIDEO_LABELS.find( (label) => label.id === selectedColor);

    if (selectedLabel) { toggle(selectedLabel); }
  }

  // TODO(Sam): Replace the hardcoded tooltip text.
  // TODO(Sam): Replace this with buttons instead of radio buttons because, oops, we need to be able to deselect.

  return (
    <div className={`label-buttons-container`}>
      <fieldset onChange={handleColorChange}>
      
        <input type="radio" id="love" name="color" value="love" defaultChecked={activeVideoLabelId === "love"}/>
        <label htmlFor="love" className="love">  Love
          <TooltipTrigger text="Add to favorites (private)">
            <LoveIcon className="label-icon" />
          </TooltipTrigger>
        </label>

        <input type="radio" id="star" name="color" value="star" defaultChecked={activeVideoLabelId === "star"}/>
        <label htmlFor="star" className="star"> Star
          <TooltipTrigger text="Add to favorites (public)">
            <StarIcon className="label-icon" />
          </TooltipTrigger>
        </label>

        <input type="radio" id="x" name="color" value="x" defaultChecked={activeVideoLabelId === "x"}/>
        <label htmlFor="x" className="x">X
          <TooltipTrigger text="Don't recommend this video to me">
            <XIcon className="label-icon" />
          </TooltipTrigger>
        </label>
        
      </fieldset>
    </div>
  );
}