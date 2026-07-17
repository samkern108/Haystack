import "../videos/VideoCard.css";
import "./Labels.css";
import { SYSTEM_VIDEO_LABELS } from "./labels";
import type { State } from "../../state/state";
import type { Video } from "../../state/types";

interface VideoLabelsDisplayProps {
  video: Video;
  state: State;
}

export default function VideoLabelsDisplay(props: VideoLabelsDisplayProps) {
  const videoState = props.state.creators?.[props.video.creatorId_yt]
    ?.videos?.[props.video.videoId_yt];

  const videoLabelId = videoState?.videoLabelId ?? null;
  const videoLabel = SYSTEM_VIDEO_LABELS.find((b) => b.id === videoLabelId);

  return videoLabelId && videoLabel &&
    <div className="label-buttons-container display">
        <div className={`label-button active display`}
        style={{ color: videoLabel.darkColor }}>
            {videoLabel.icon}
        </div>
    </div>
}