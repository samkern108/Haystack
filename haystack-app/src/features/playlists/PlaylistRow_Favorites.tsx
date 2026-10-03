import { useMemo, useState } from "react";
import { VideoCard } from "../videos/VideoCard";
import type { State, Action } from "../../state/state";
import { getCreatorById } from "../../utils/videohelpers";
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

      <div className="video-strip">
        {displayedVideos.map(([creatorId, videoId]) => {
          const creator = getCreatorById(creatorId);
          if (!creator) {
            console.error(`Creator not found for ID: ${creatorId}`);
            return null;
          }
          const video = creator.videos[videoId];
          if (!video) {
            console.error(`Video not found for ID: ${videoId} in creator ${creatorId}`);
            return null;
          }
          return (
            <VideoCard
              key={video.video_id}
              creator={creator}
              video={video}
              state={props.state}
              displayCreator={true}
              dispatch={props.dispatch}
            />
          );
        })}
      </div>
    </section>
  );
}