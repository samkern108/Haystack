import "./VideoCard.css";
import { tagIcon } from "./videolabelsvg";
import { SYSTEMVIDEOLABELS, type VideoLabel } from "./videolabels";
import type { Action, State } from "../../state/creatorVideoState";
import type { Video } from "../../types";
import { useState } from "react";
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
                
                return (
                    <VideoLabelButton 
                      key={b.id}
                      label={b.id} 
                      active={isActive} 
                      onClick={() => toggle(b)}>
                    </VideoLabelButton>
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