import "./VideoCard.css";
import { videoLabelButtons } from "./videolabelbuttons";
import type { Reaction, State } from "../../state/creatorVideoState";
import type { Video } from "../../types";

interface VideoLabelsPopupProps {
  video: Video;
  state: State;
}

const DisplayActiveOverlay = (activeReaction: Reaction) => {
    const activeButton = videoLabelButtons.find((b) => b.id === activeReaction);
    if (!activeButton) return;

    return (
    <div className="label-buttons-container display">
        <div className="label-buttons-overlay">
            <button
            key={activeReaction}
            title={activeButton.label}
            className={`label-button ${activeReaction} active display`}
            >
            <span className="label-icon-wrapper">{activeButton.icon}</span>
            </button>
        </div>
    </div>
    );
};

export default function VideoLabelsPopup(props: VideoLabelsPopupProps) {
  const videoState = props.state.creators?.[props.video.video_creatorId_yt]
    ?.videos?.[props.video.videoId_yt];

  const activeReaction = videoState?.reaction ?? null;

  return activeReaction && DisplayActiveOverlay(activeReaction);
}