import { useState } from "react";

import "./VideoFilterMenu.scss";
import { TimeFilterSelector } from "./TimeFilterSelector";
import { type CreatorState, type VideoFilterState, type VideoTagState } from "../../state/state";
import { TagFilterSelector } from "./TagFilterSelector";

export type CreatorFilter = "followed" | "unfollowed" | "all";
export type WatchedFilter = "yes" | "no" | "all";

interface VideoFilterMenuProps {
  videoFilterState: VideoFilterState;
  videoTagState: VideoTagState;
  creatorStates: Record<string, CreatorState>;
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
        props.videoFilterState.creator === "all"
          ? "followed"
          : props.videoFilterState.creator === "followed"
            ? "unfollowed"
            : "all",
    });
  }

  function cycleWatchedFilter() {
    updateFilters({
      watched:
        props.videoFilterState.watched === "all"
          ? "yes"
          : props.videoFilterState.watched === "yes"
            ? "no"
            : "all",
    });
  }

  return (
    <div className="video-filter">
      <button
        className="video-filter-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "▲ Filters" : "▼ Filters"}
      </button>

      {isOpen && (
        <div className="video-filter-menu">
          <div className="video-filter-row inline">
            <span className="video-filter-label">Creator</span>

            <button
              className="video-filter-toggle"
              onClick={cycleCreatorFilter}
            >
              {props.videoFilterState.creator}
            </button>
          </div>

          <div className="video-filter-row inline">
            <span className="video-filter-label">Watched</span>

            <button
              className="video-filter-toggle"
              onClick={cycleWatchedFilter}
            >
              {props.videoFilterState.watched}
            </button>
          </div>

          <div className="video-filter-row">
            <span className="video-filter-label">Duration</span>

            <TimeFilterSelector
              minTime={props.videoFilterState.minTime}
              maxTime={props.videoFilterState.maxTime}
              onMinTimeChange={(minTime) => updateFilters({ minTime })}
              onMaxTimeChange={(maxTime) => updateFilters({ maxTime })}
            />
          </div>

          <div className="video-filter-row">
            <span className="video-filter-label">Included Tags</span>
            <TagFilterSelector
              onTagsChanged={(tags: string[]) =>
                updateFilters({ includeTags: tags })
              }
              selectedTagNames={props.videoFilterState.includeTags}
              tagsState={props.videoTagState}
              creatorStates={props.creatorStates}
            />          
          </div>

          <div className="video-filter-row">
            <span className="video-filter-label">Excluded Tags</span>
            <TagFilterSelector
              onTagsChanged={(tags: string[]) => updateFilters({ excludeTags: tags })}
              selectedTagNames={props.videoFilterState.excludeTags} 
              tagsState={props.videoTagState}
              creatorStates={props.creatorStates} />
          </div>
        </div>
      )}
    </div>
  );
}
