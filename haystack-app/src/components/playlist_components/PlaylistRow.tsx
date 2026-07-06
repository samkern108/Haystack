import { VideoCard } from "../video_components/VideoCard";
import './PlaylistRow.css'
import type { State, Action, PlaylistState } from "../../state/creatorVideoState";
import { getVideosByIds } from "../video_components/videohelpers";
import { SYSTEMVIDEOLABELS } from "../video_components/videolabels";

interface PlaylistRowProps {
  playlist: PlaylistState;
  state: State;
  dispatch: React.ActionDispatch<[action: Action]>;
}

export function PlaylistRow( props : PlaylistRowProps) {

  const playlistVideos = getVideosByIds(props.playlist.videoIds);
  const videoLabel = SYSTEMVIDEOLABELS.find((b) => b.id === props.playlist.videoLabelId);
  console.log(props.playlist.videoLabelId, videoLabel);

  return (
    <section className="playlist-row">
      <div>
        { videoLabel?.icon }
        <h2>{ props.playlist.name }</h2>
      </div>
      
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