import "./VideoCard.css";
import "./VideoLabels.css";
import { SYSTEMVIDEOLABELS } from "./videolabels";
import type { State } from "../../state/creatorVideoState";
import type { Video } from "../../types";

interface VideoLabelsPopupProps {
  video: Video;
  state: State;
}

export default function VideoLabelsPopup(props: VideoLabelsPopupProps) {
  const videoState = props.state.creators?.[props.video.creatorId_yt]
    ?.videos?.[props.video.videoId_yt];

  const videoLabelId = videoState?.videoLabelId ?? null;
  const videoLabel = SYSTEMVIDEOLABELS.find((b) => b.id === videoLabelId);

  return videoLabelId && videoLabel &&
    <div className="label-buttons-container display">
        <div className={`label-button active display`}
        style={{ color: videoLabel.darkColor }}>
            {videoLabel.icon}
        </div>
    </div>
}