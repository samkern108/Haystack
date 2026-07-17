import type { Creator } from "../../types";
import { VideoCard } from "../video/VideoCard";
import './CreatorRow.css'
import '../video/VideoCard.css'
import { CreatorInfo } from "./CreatorInfo";
import type { State, Action } from "../../state/creatorVideoState";
import { getVideosByIds } from "../../utils/videohelpers";

interface CreatorRowProps {
  creator: Creator;
  state: State;
  dispatch: React.ActionDispatch<[action: Action]>;
}

export function CreatorRow( props : CreatorRowProps) {
  return (
    <section className="creator-row">
      <CreatorInfo creator={props.creator} />

      <div className="video-strip">
        {getVideosByIds(props.creator.videoIds).map((video) => (
          <VideoCard
            key={video.videoId_yt}
            video={video}
            state={props.state}
            dispatch={props.dispatch}
          />
        ))}
      </div>
    </section>
  );
}