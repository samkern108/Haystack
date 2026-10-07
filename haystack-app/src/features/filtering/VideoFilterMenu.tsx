import { useState } from "react";

import "./VideoFilterMenu.scss";
import { TimeFilterSelector } from "./TimeFilterSelector";
import { getVideoFilterStates, type State, type VideoFilterState } from "../../state/state";

export type CreatorFilter = "followed" | "unfollowed" | "both";
export type WatchedFilter = "yes" | "no" | "both";

// TODO(samkern):
// there's a bug here I don't wanna fix right now :(
// videos longer than 4h will NEVER DISPLAY because of the way filter
// logic is coded.

interface VideoFilterMenuProps {
  state: State;
  dispatch: React.ActionDispatch<[
    action: { type: "SET_VIDEO_FILTERS"; filters: VideoFilterState }
  ]>;
}

export function VideoFilterMenu(props: VideoFilterMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const filters = getVideoFilterStates(props.state);

  function updateFilters(update: Partial<VideoFilterState>) {
    props.dispatch({
      type: "SET_VIDEO_FILTERS",
      filters: {
        ...filters,
        ...update,
      },
    });
  }

  function cycleCreatorFilter() {
    updateFilters({
      creator:
        filters.creator === "both"
          ? "followed"
          : filters.creator === "followed"
            ? "unfollowed"
            : "both",
    });
  }

  function cycleWatchedFilter() {
    updateFilters({
      watched:
        filters.watched === "both"
          ? "yes"
          : filters.watched === "yes"
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
              {filters.creator}
            </button>
          </div>

          <div className="video-filter-row">
            <span className="video-filter-label">Watched</span>

            <button
              className="video-filter-toggle"
              onClick={cycleWatchedFilter}
            >
              {filters.watched}
            </button>
          </div>

          <div className="video-filter-row">
            <span className="video-filter-label">Time</span>

            <TimeFilterSelector
              minTime={filters.minTime}
              maxTime={filters.maxTime}
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