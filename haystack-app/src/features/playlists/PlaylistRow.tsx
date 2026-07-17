import { VideoCard } from "../videos/VideoCard";
import type { State, Action, PlaylistState } from "../../state/state";
import { getVideosByIds } from "../../utils/videohelpers";
import { SYSTEM_VIDEO_LABELS } from "../labels/labels";
import './PlaylistRow.css'

interface PlaylistRowProps {
  playlist: PlaylistState;
  state: State;
  dispatch: React.ActionDispatch<[action: Action]>;
}

export function PlaylistRow( props : PlaylistRowProps) {

  const playlistVideos = getVideosByIds(props.playlist.videoIds);
  const videoLabel = SYSTEM_VIDEO_LABELS.find((b) => b.id === props.playlist.videoLabelId);
  console.log(props.playlist.videoLabelId, videoLabel);

  return (
    <section className="playlist-row">
      <div className="playlist-info">
        <div className={`playlist-label-button`}
          style={{ color: videoLabel?.darkColor }}>
          { videoLabel?.icon }
        </div>
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