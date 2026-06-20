import "./VideoCard.css";
import { videoLabelButtons } from "./videolabelbuttons";
import type { Action, State } from "../../state/creatorVideoState";
import type { Video } from "../../types";

interface VideoLabelsPopupProps {
  video: Video;
  state: State;
  dispatch: React.ActionDispatch<[action: Action]>;
}

export default function VideoLabelsPopup(props: VideoLabelsPopupProps) {
  const videoState = props.state.creators?.[props.video.video_creatorId_yt]
    ?.videos?.[props.video.videoId_yt];

  const activeReaction = videoState?.reaction ?? null;

  const toggle = (id: string) => {
    props.dispatch({
        type: "SET_REACTION",
        creatorId: props.video.video_creatorId_yt,
        videoId: props.video.videoId_yt,
        reaction: id as "love" | "star" | "x"
    });
  };

  return (
   
    <div className="label-buttons-container">
      <div className="label-buttons-overlay">
        {videoLabelButtons.map((b) => {
          const isActive = (activeReaction === b.id);
          const className = `label-button ${b.id} ${isActive ? "active" : ""}`;
          return (
            <button
              key={b.id}
              onClick={() => toggle(b.id)}
              title={b.label}
              className={className}
            >
              <span className="label-icon-wrapper">{b.icon}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}