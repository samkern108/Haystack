import "./VideoCard.css";
import { tagIcon, DEFAULTVIDEOLABELS, type VideoLabelDef } from "./videolabels";
import type { Action, State } from "../../state/creatorVideoState";
import type { Video } from "../../types";
import { useState } from "react";

interface VideoLabelsPopupProps {
  video: Video;
  state: State;
  dispatch: React.ActionDispatch<[action: Action]>;
}

export default function VideoLabelsPopup(props: VideoLabelsPopupProps) {
  const videoState =
    props.state.creators?.[props.video.creatorId_yt]
      ?.videos?.[props.video.videoId_yt];

  const activeReaction = videoState?.videoLabel ?? null;

  const [expanded, setExpanded] = useState(false);

  const toggle = (videoLabelDef: VideoLabelDef) => {
    props.dispatch({
      type: "SET_VIDEO_LABEL",
      creatorId: props.video.creatorId_yt,
      videoId: props.video.videoId_yt,
      videoLabelDef: videoLabelDef,
    });
  };

  const DisplayVideoLabels = () => {
    return (
        <>
            {DEFAULTVIDEOLABELS.map((b) => {
                const isActive = activeReaction === b.id;
                const className = `label-button ${b.id} ${ isActive ? "active" : "" }`;

                return (
                <button
                    key={b.id}
                    className={className}
                    onClick={() => toggle(b)}
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