import { useMemo, useState } from "react";
import type { State, Action } from "../../state/state";
import { SYSTEM_VIDEO_LABELS } from "../labels/labels";
import './PlaylistRow.css'
import { LoveIcon, StarIcon } from "../labels/icons";
import { VideoStrip } from "../videos/VideoStrip";

interface PlaylistRow_FavoritesProps {
  state: State;
  dispatch: React.ActionDispatch<[action: Action]>;
}

export function PlaylistRow_Favorites(props: PlaylistRow_FavoritesProps) {
  const [filter, setFilter] = useState<"all" | "star" | "love">("all");

  const playlistState_Star = props.state.playlistStates["star"];
  const playlistState_Heart = props.state.playlistStates["love"];

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
        return playlistState_Star.videoIds;

      case "love":
        return playlistState_Heart.videoIds;

      default:
        return [...playlistState_Star.videoIds, ...playlistState_Heart.videoIds];
    }
  }, [filter, playlistState_Star, playlistState_Heart]);

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

      <VideoStrip state={props.state} videoIds={displayedVideos} dispatch={props.dispatch} displayCreator={false}>
      </VideoStrip>
    </section>
  );
}