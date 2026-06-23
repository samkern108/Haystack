import "./VideoCard.css";
import { tagIcon, videoLabels } from "./videolabels";
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

  const DisplayVideoLabels = () => {
    return (
        <>
            {videoLabels.map((b) => {
                const isActive = activeReaction === b.id;
                const className = `label-button ${b.id} ${ isActive ? "active" : "" }`;

                return (
                <button
                    key={b.id}
                    className={className}
                    onClick={() => toggle(b.id)}
                >
                    {b.icon}
                </button>
                );
            })}
        </>
      )
    }

  // BUG – the reason animation doesn't work for this state is that
  // the other labels are not rendered, and when they are suddenly
  // added to the DOM on mouseover, animation will not trigger.
  const DisplayTagIcon = () => {
    return (
        <div className={`label-button active`} >
            {tagIcon}
        </div>
        )
    }

  return (
        <div
        className={`label-buttons-container ${
            expanded ? "expanded" : "collapsed"
        }`}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        >
            {
            (!activeReaction && !expanded) ?
                DisplayTagIcon() :
                DisplayVideoLabels()
            }
        </div>
  );
}