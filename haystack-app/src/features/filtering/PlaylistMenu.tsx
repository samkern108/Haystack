import { useState } from "react";

import "./VideoFilterMenu.scss";
import { type VideoFilterState } from "../../state/state";
import { getVideoLabelIcon } from "../labels/icons";

interface PlaylistMenuProps {
  videoFilterState: VideoFilterState;
  dispatch: React.ActionDispatch<[
    action: { type: "SET_VIDEO_FILTERS"; filters: VideoFilterState }
  ]>;
}

export function PlaylistMenu(props: PlaylistMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  function updateFilters(update: Partial<VideoFilterState>) {
    props.dispatch({
      type: "SET_VIDEO_FILTERS",
      filters: {
        ...props.videoFilterState,
        ...update,
      },
    });
  }

  function toggleWatchLaterFilter(): void {
    updateFilters({ inWatchLater: !props.videoFilterState.inWatchLater });
  }

  return (
    <div className="video-filter">
      <button
        className="video-filter-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "▲ Playlists" : "▼ Playlists"}
      </button>

      {isOpen && (
        <div className="video-filter-menu playlist-menu">

          <div className="video-filter-row">
            <button
              type="button"
              className={`love-playlist-filter ${props.videoFilterState.inLove ? "active" : "inactive"}`}
              aria-label="Heart playlist (private favorites)"
              aria-pressed={!!props.videoFilterState.inLove}
              onClick={() => updateFilters({ inLove: !props.videoFilterState.inLove })}
            >
              {getVideoLabelIcon("love", "label-icon")}
            </button>
            <button
              key={"watchlater"}
              type="button"
              aria-label="Watch Later playlist"
              aria-pressed={props.videoFilterState.inWatchLater}
              className={`watch-later-filter ${
                props.videoFilterState.inWatchLater ? "active" : "inactive"
              }`}
              onClick={() => toggleWatchLaterFilter()}
            >
              { getVideoLabelIcon("watchlater", "label-icon") }
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
