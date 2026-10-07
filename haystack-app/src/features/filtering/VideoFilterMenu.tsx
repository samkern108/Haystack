import { useState } from "react";

import "./VideoFilterMenu.scss";
import { TimeFilterSelector } from "./TimeFilterSelector";
import { type VideoFilterState } from "../../state/state";

export type CreatorFilter = "followed" | "unfollowed" | "both";
export type WatchedFilter = "yes" | "no" | "both";

// TODO(samkern):
// there's a bug here I don't wanna fix right now :(
// videos longer than 4h will NEVER DISPLAY because of the way filter
// logic is coded.

interface VideoFilterMenuProps {
  videoFilterState: VideoFilterState;
  dispatch: React.ActionDispatch<[
    action: { type: "SET_VIDEO_FILTERS"; filters: VideoFilterState }
  ]>;
}

export function VideoFilterMenu(props: VideoFilterMenuProps) {
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

  function cycleCreatorFilter() {
    updateFilters({
      creator:
        props.videoFilterState.creator === "both"
          ? "followed"
          : props.videoFilterState.creator === "followed"
            ? "unfollowed"
            : "both",
    });
  }

  function cycleWatchedFilter() {
    updateFilters({
      watched:
        props.videoFilterState.watched === "both"
          ? "yes"
          : props.videoFilterState.watched === "yes"
            ? "no"
            : "both",
    });
  }

  return (
    <div className="video-filter">
      <button
        className="video-filter-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "Close Filters" : "Open Filters"}
      </button>

      {isOpen && (
        <div className="video-filter-menu">
          <div className="video-filter-row">
            <span className="video-filter-label">Creator</span>

            <button
              className="video-filter-toggle"
              onClick={cycleCreatorFilter}
            >
              {props.videoFilterState.creator}
            </button>
          </div>

          <div className="video-filter-row">
            <span className="video-filter-label">Watched</span>

            <button
              className="video-filter-toggle"
              onClick={cycleWatchedFilter}
            >
              {props.videoFilterState.watched}
            </button>
          </div>

          <div className="video-filter-row">
            <span className="video-filter-label">Time</span>

            <TimeFilterSelector
              minTime={props.videoFilterState.minTime}
              maxTime={props.videoFilterState.maxTime}
              onMinTimeChange={(minTime) =>
                updateFilters({ minTime })
              }
              onMaxTimeChange={(maxTime) =>
                updateFilters({ maxTime })
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}