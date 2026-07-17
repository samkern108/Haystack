import { SYSTEM_VIDEO_LABELS, type VideoLabel } from "./labels";
import type { Action, State } from "../../state/state";
import type { Video } from "../../state/types";
import { LoveIcon, StarIcon, XIcon } from "./icons";
import { Tooltip } from "../ui/Tooltip";
import { useDelayedHover } from "../../utils/hoverlogic";
import "../videos/VideoCard.css";
import "../ui/Tooltip.css"

interface VideoLabelsPopupProps {
  video: Video;
  state: State;
  dispatch: React.ActionDispatch<[action: Action]>;
}

export default function VideoLabelsPopup(props: VideoLabelsPopupProps) {
  const videoState =
    props.state.creators?.[props.video.creatorId_yt]
      ?.videos?.[props.video.videoId_yt];

  const activeVideoLabelId = videoState?.videoLabelId ?? null;

  const hover = useDelayedHover(600);

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

  return (
    <div className={`label-buttons-container`}>
      <fieldset className="card__color-picker" onChange={handleColorChange}>
        <input type="radio" id="love" name="color" value="love" defaultChecked={activeVideoLabelId === "love"}/>
        <label htmlFor="love" className="tooltip-wrapper" onPointerEnter={hover.onPointerEnter} onPointerLeave={hover.onPointerLeave}>  Love
          <LoveIcon className="label-icon" style={{ color: "var(--color-love)" }} />
          <Tooltip text="heart tooltip explainer" />
        </label>

        <input type="radio" id="star" name="color" value="star" defaultChecked={activeVideoLabelId === "star"}/>
        <label htmlFor="star" onPointerEnter={hover.onPointerEnter} onPointerLeave={hover.onPointerLeave}> Star
          <StarIcon className="label-icon" style={{ color: "var(--color-star)" }} />
          <Tooltip text="star tooltip explainer" />
        </label>

        <input type="radio" id="x" name="color" value="x" defaultChecked={activeVideoLabelId === "x"}/>
        <label htmlFor="x" onPointerEnter={hover.onPointerEnter} onPointerLeave={hover.onPointerLeave}>X
          <XIcon className="label-icon" style={{ color: "var(--color-x)" }} />
          <Tooltip text="x tooltip explainer" />
        </label>
      </fieldset>
    </div>
  );
}