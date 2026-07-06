import "./VideoCard.css";
import { tagIcon } from "./videolabelsvg";
import { SYSTEMVIDEOLABELS, type VideoLabel } from "./videolabels";
import type { Action, State } from "../../state/creatorVideoState";
import type { Video } from "../../types";
import { useState } from "react";
import { findVideoLabelById } from "./videolabels";
import { useDelayedHover } from "../helpers/hoverlogic";
import { VideoLabelButton } from "./VideoLabelButton";

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

  const [expanded, setExpanded] = useState(false);

  const toggle = (videoLabel: VideoLabel) => {
    props.dispatch({
      type: "SET_VIDEO_LABEL",
      creatorId: props.video.creatorId_yt,
      videoId: props.video.videoId_yt,
      videoLabel: videoLabel,
    });
  };

  const DisplayVideoLabels = () => {
    return (
        <>
            {SYSTEMVIDEOLABELS.map((b) => {
                const isActive = activeVideoLabelId === b.id;
                const className = `label-button ${ isActive ? "active" : "" }`;
                const videoLabel = findVideoLabelById(b.id);
                
                return (

                    <VideoLabelButton 
                      label={b.id} 
                      active={false} 
                      onClick={() => toggle(b)}>
                    </VideoLabelButton>
                    
                /*<button
                    key={b.id}
                    className={className}
                    onClick={() => toggle(b)}
                    style={{ color: videoLabel?.darkColor , backgroundColor: isActive ? videoLabel?.lightColor : "transparent" }}>
                    {b.icon}

                    {hover.hovered && (
                    <div className="tooltip">
                        {"I am a tooltip!"}
                    </div>
                )}
                </button>*/

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
            { tagIcon }
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
            (!activeVideoLabelId && !expanded) ?
                DisplayTagIcon() :
                DisplayVideoLabels()
            }
        </div>
  );
}