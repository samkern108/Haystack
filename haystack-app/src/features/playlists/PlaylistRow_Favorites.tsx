import { useMemo, useState } from "react";
import { VideoCard } from "../videos/VideoCard";
import type { State, Action } from "../../state/state";
import { getVideosByIds } from "../../utils/videohelpers";
import { SYSTEM_VIDEO_LABELS } from "../labels/labels";
import './PlaylistRow.css'
import { LoveIcon, StarIcon } from "../labels/icons";

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

  const videoLabel_Star = SYSTEM_VIDEO_LABELS.find(
    (b) => b.id === playlistState_Star.videoLabelId
  );

  const videoLabel_Heart = SYSTEM_VIDEO_LABELS.find(
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
              ? { color: videoLabel_Star?.color }
              : undefined
          }
          onClick={() => setFilter(filter === "star" ? "all" : "star")}
        >
          <StarIcon />
        </div>

        <div
          className={`playlist-label-button ${
            filter === "love" ? "active" : ""
          }`}
          style={
            (filter === "love" || filter === 'all' )
              ? { color: videoLabel_Heart?.color }
              : undefined
          }
          onClick={() => setFilter(filter === "love" ? "all" : "love")}
        >
          <LoveIcon />
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