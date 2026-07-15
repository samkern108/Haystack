import { VideoCard } from "../video_components/VideoCard";
import './PlaylistRow.css'
import type { State, Action, PlaylistState } from "../../state/creatorVideoState";
import { getVideosByIds } from "../video_components/videohelpers";
import { SYSTEMVIDEOLABELS } from "../video_components/videolabels";

interface PlaylistRow_FavoritesProps {
  state: State;
  dispatch: React.ActionDispatch<[action: Action]>;
}

export function PlaylistRow_Favorites( props : PlaylistRow_FavoritesProps) {

  const playlistState_Star = props.state.playlists['star'];
  const playlistState_Heart = props.state.playlists['love'];

  const playlistVideos_Star = getVideosByIds(playlistState_Star.videoIds);
  const playlistVideos_Heart = getVideosByIds(playlistState_Heart.videoIds);
  const allFavoritesVideos = [...playlistVideos_Star, ...playlistVideos_Heart];

  const videoLabel = SYSTEMVIDEOLABELS.find((b) => b.id === playlistState_Star.videoLabelId);

  return (
    <section className="playlist-row">
      <div className="playlist-info">
        <div className={`playlist-label-button`}
          style={{ color: videoLabel?.darkColor }}>
          { videoLabel?.icon }
        </div>
        <h2>{ 'Favorites' }</h2>
      </div>
      
      <div className="video-strip">
        {allFavoritesVideos.map((video) => (
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