import "./VideoCard.css";
import "./VideoLabels.css";
import { DEFAULTVIDEOLABELS } from "./videolabels";
import type { State } from "../../state/creatorVideoState";
import type { Video } from "../../types";

interface VideoLabelsPopupProps {
  video: Video;
  state: State;
}

export default function VideoLabelsPopup(props: VideoLabelsPopupProps) {
  const videoState = props.state.creators?.[props.video.creatorId_yt]
    ?.videos?.[props.video.videoId_yt];

  const activeReaction = videoState?.videoLabel ?? null;
  const activeButton = DEFAULTVIDEOLABELS.find((b) => b.id === activeReaction);

  return activeReaction && activeButton &&
    <div className="label-buttons-container display">
        <div className={`label-button ${activeReaction} active display`}>
            {activeButton.icon}
        </div>
    </div>
}