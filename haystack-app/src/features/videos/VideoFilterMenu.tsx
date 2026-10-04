import { useEffect, useState } from "react";

import "./VideoFilterMenu.scss";
import { TimeFilterSelector } from "./TimeFilterSelector";

type CreatorFilter = "followed" | "unfollowed" | "both";
type WatchedFilter = "yes" | "no" | "both";

interface VideoFilterState {
  creator: CreatorFilter;
  watched: WatchedFilter;
  minTime: number;
  maxTime: number;
}

const DEFAULT_FILTERS: VideoFilterState = {
  creator: "both",
  watched: "both",
  minTime: 0,
  maxTime: 240,
};

const FILTER_STORAGE_KEY = "video-filters";

export function VideoFilterMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const [filters, setFilters] = useState<VideoFilterState>(() => {
    const saved = localStorage.getItem(FILTER_STORAGE_KEY);

    if (!saved) {
      return DEFAULT_FILTERS;
    }

    try {
      return {
        ...DEFAULT_FILTERS,
        ...JSON.parse(saved),
      };
    } catch {
      return DEFAULT_FILTERS;
    }
  });

  useEffect(() => {
    localStorage.setItem(
      FILTER_STORAGE_KEY,
      JSON.stringify(filters)
    );
  }, [filters]);

  function cycleCreatorFilter() {
    setFilters(current => ({
      ...current,
      creator:
        current.creator === "both"
          ? "followed"
          : current.creator === "followed"
            ? "unfollowed"
            : "both",
    }));
  }

  function cycleWatchedFilter() {
    setFilters(current => ({
      ...current,
      watched:
        current.watched === "both"
          ? "yes"
          : current.watched === "yes"
            ? "no"
            : "both",
    }));
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
                setFilters(current => ({
                  ...current,
                  minTime,
                }))
              }
              onMaxTimeChange={(maxTime) =>
                setFilters(current => ({
                  ...current,
                  maxTime,
                }))
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}