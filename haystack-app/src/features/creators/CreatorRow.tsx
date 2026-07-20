import type { Creator } from "../../state/types";
import { VideoCard } from "../videos/VideoCard";
import { CreatorInfo } from "./CreatorInfo";
import type { State, Action } from "../../state/state";
import { getVideosByIds } from "../../utils/videohelpers";
import './CreatorRow.css'
import '../videos/VideoCard.css'

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
            displayCreator={false}
            dispatch={props.dispatch}
          />
        ))}
      </div>
    </section>
  );
}