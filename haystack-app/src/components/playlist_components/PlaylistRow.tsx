import { VideoCard } from "../video_components/VideoCard";
import './PlaylistRow.css'
import '../video_components/VideoCard.css'
import type { State, Action, PlaylistState } from "../../state/creatorVideoState";
import { getVideosByIds } from "../video_components/videohelpers";

interface PlaylistRowProps {
  playlist: PlaylistState;
  state: State;
  dispatch: React.ActionDispatch<[action: Action]>;
}

export function PlaylistRow( props : PlaylistRowProps) {

  const playlistVideos = getVideosByIds(props.playlist.videoIds);

  return (
    <section className="playlist-row">
      <div className="video-strip">
        {playlistVideos.map((video) => (
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