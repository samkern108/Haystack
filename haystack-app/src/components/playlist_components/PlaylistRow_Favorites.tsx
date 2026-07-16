import { VideoCard } from "../video_components/VideoCard";
import './PlaylistRow.css'
import type { State, Action } from "../../state/creatorVideoState";
import { getVideosByIds } from "../video_components/videohelpers";
import { SYSTEMVIDEOLABELS } from "../video_components/videolabels";
import { useMemo, useState } from "react";

interface PlaylistRow_FavoritesProps {
  state: State;
  dispatch: React.ActionDispatch<[action: Action]>;
}

export function PlaylistRow_Favorites(props: PlaylistRow_FavoritesProps) {
  const [filter, setFilter] = useState<"all" | "star" | "love">("all");

  const playlistState_Star = props.state.playlists["star"];
  const playlistState_Heart = props.state.playlists["love"];

  const playlistVideos_Star = getVideosByIds(playlistState_Star.videoIds);
  const playlistVideos_Heart = getVideosByIds(playlistState_Heart.videoIds);

  const sectionTitle = useMemo(() => {
    switch (filter) {
      case "star":
        return "Favorites (Public Only)";

      case "love":
        return "Favorites (Private Only)";

      default:
        return "Favorites (All)";
    }
  }, [filter]);

  const displayedVideos = useMemo(() => {
    switch (filter) {
      case "star":
        return playlistVideos_Star;

      case "love":
        return playlistVideos_Heart;

      default:
        return [...playlistVideos_Star, ...playlistVideos_Heart];
    }
  }, [filter, playlistVideos_Star, playlistVideos_Heart]);

  const videoLabel_Star = SYSTEMVIDEOLABELS.find(
    (b) => b.id === playlistState_Star.videoLabelId
  );

  const videoLabel_Heart = SYSTEMVIDEOLABELS.find(
    (b) => b.id === playlistState_Heart.videoLabelId
  );

  return (
    <section className="playlist-row">
      <div className="playlist-info">

      <div className="playlist-label-buttons">
        <div
          className={`playlist-label-button ${
            filter === "star" ? "active" : ""
          }`}
          style={
            (filter === "star" || filter === 'all' )
              ? { color: videoLabel_Star?.darkColor }
              : undefined
          }
          onClick={() => setFilter(filter === "star" ? "all" : "star")}
        >
          {videoLabel_Star?.icon}
        </div>

        <div
          className={`playlist-label-button ${
            filter === "love" ? "active" : ""
          }`}
          style={
            (filter === "love" || filter === 'all' )
              ? { color: videoLabel_Heart?.darkColor }
              : undefined
          }
          onClick={() => setFilter(filter === "love" ? "all" : "love")}
        >
          {videoLabel_Heart?.icon}
        </div>
      </div>

        <h2>{sectionTitle}</h2>
      </div>

      <div className="video-strip">
        {displayedVideos.map((video) => (
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