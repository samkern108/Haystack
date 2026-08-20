import { useState } from "react";

import "./VideoFilterMenu.scss";
import { TimeFilterSelector } from "./TimeFilterSelector";

type CreatorFilter = "followed" | "unfollowed" | "both";
type WatchedFilter = "yes" | "no" | "both";

export function VideoFilterMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const [creatorFilter, setCreatorFilter] =
    useState<CreatorFilter>("both");

  const [watchedFilter, setWatchedFilter] =
    useState<WatchedFilter>("both");

  function cycleCreatorFilter() {
    setCreatorFilter(current => {
      if (current === "both") return "followed";
      if (current === "followed") return "unfollowed";
      return "both";
    });
  }

  function cycleWatchedFilter() {
    setWatchedFilter(current => {
      if (current === "both") return "yes";
      if (current === "yes") return "no";
      return "both";
    });
  }

  return (
    <div className="video-filter">
      <button
        className="video-filter-button"
        onClick={() => setIsOpen(true)}
      >
        Filter
      </button>

      {isOpen && (
        <div className="video-filter-menu">
          <button
            className="video-filter-close"
            onClick={() => setIsOpen(false)}
          >
            ×
          </button>

          <div className="video-filter-row">
            <span className="video-filter-label">Creator</span>

            <button
              className="video-filter-toggle"
              onClick={cycleCreatorFilter}
            >
              {creatorFilter}
            </button>
          </div>

          <div className="video-filter-row">
            <span className="video-filter-label">Watched</span>

            <button
              className="video-filter-toggle"
              onClick={cycleWatchedFilter}
            >
              {watchedFilter}
            </button>
          </div>

          <div className="video-filter-row">
            <span className="video-filter-label">Time</span>
            <TimeFilterSelector />
          </div>
        </div>
      )}
    </div>
  );
}