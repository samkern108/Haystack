import "./VideoCard.css";
import { videoLabelButtons } from "./videolabelbuttons";
import type { Action, Reaction, State } from "../../state/creatorVideoState";
import type { Video } from "../../types";
import { useState } from "react";

interface VideoLabelsPopupProps {
  video: Video;
  state: State;
  dispatch: React.ActionDispatch<[action: Action]>;
}

export default function VideoLabelsPopup(props: VideoLabelsPopupProps) {
  const videoState =
    props.state.creators?.[props.video.video_creatorId_yt]
      ?.videos?.[props.video.videoId_yt];

  const activeReaction = videoState?.reaction ?? null;

  const [expanded, setExpanded] = useState(false);

  const toggle = (id: string) => {
    props.dispatch({
      type: "SET_REACTION",
      creatorId: props.video.video_creatorId_yt,
      videoId: props.video.videoId_yt,
      reaction: id as Reaction,
    });
  };

  return (
    <div
      className={`label-buttons-container ${
        expanded ? "expanded" : "collapsed"
      }`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {videoLabelButtons.map((b) => {
        const isActive = activeReaction === b.id;

        return (
          <button
            key={b.id}
            className={`label-button ${b.id} ${
              isActive ? "active" : ""
            }`}
            onClick={() => toggle(b.id)}
          >
            {b.icon}
          </button>
        );
      })}
    </div>
  );
}