import { useState } from "react";

import "./VideoFilterMenu.scss";
import { TimeFilterSelector } from "./TimeFilterSelector";
import { type Action, type FilterPreset, type CreatorState, type VideoFilterState, type VideoTagState } from "../../state/state";
import { TagFilterSelector } from "./TagFilterSelector";

export type CreatorFilter = "followed" | "unfollowed" | "all";
export type WatchedFilter = "yes" | "no" | "all";

interface VideoFilterMenuProps {
  videoFilterState: VideoFilterState;
  videoTagState: VideoTagState;
  creatorStates: Record<string, CreatorState>;
  filterPresets: FilterPreset[];
  activeFilterPresetId?: string;
  dispatch: React.ActionDispatch<[action: Action]>;
}

export function VideoFilterMenu(props: VideoFilterMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [presetName, setPresetName] = useState("");

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

          <div className="video-filter-row tag-filter-row">
            <span className="video-filter-label tag-filter-icon" role="img" aria-label="Included Tags" title="Included Tags">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 3h8l10 10-8 8L3 11Z" />
                <circle cx="7.5" cy="7.5" r="1" />
              </svg>
            </span>
            <TagFilterSelector
              onTagsChanged={(tags: string[]) =>
                updateFilters({ includeTags: tags })
              }
              selectedTagNames={props.videoFilterState.includeTags}
              tagsState={props.videoTagState}
              creatorStates={props.creatorStates}
            />          
          </div>

          <div className="video-filter-row tag-filter-row">
            <span className="video-filter-label tag-filter-icon" role="img" aria-label="Excluded Tags" title="Excluded Tags">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 3h8l10 10-8 8L3 11Z" />
                <circle cx="7.5" cy="7.5" r="1" />
                <path d="m3 21 18-18" strokeWidth="2.5" />
              </svg>
            </span>
            <TagFilterSelector
              onTagsChanged={(tags: string[]) => updateFilters({ excludeTags: tags })}
              selectedTagNames={props.videoFilterState.excludeTags} 
              tagsState={props.videoTagState}
              creatorStates={props.creatorStates} />
          </div>
          <div className="filter-presets">
            {props.filterPresets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                className="filter-preset"
                aria-pressed={props.activeFilterPresetId === preset.id}
                onClick={() => props.dispatch({ type: "TOGGLE_FILTER_PRESET", id: preset.id })}
              >
                {preset.name}
              </button>
            ))}
            {isSaving ? (
              <form onSubmit={(event) => {
                event.preventDefault();
                if (!presetName.trim()) return;
                props.dispatch({ type: "SAVE_FILTER_PRESET", id: crypto.randomUUID(), name: presetName });
                setPresetName("");
                setIsSaving(false);
              }}>
                <input
                  autoFocus
                  aria-label="Filter preset name"
                  placeholder="Filter name"
                  value={presetName}
                  onChange={(event) => setPresetName(event.target.value)}
                  required
                />
                <button type="submit" disabled={!presetName.trim()}>Save</button>
                <button type="button" onClick={() => { setIsSaving(false); setPresetName(""); }}>Cancel</button>
              </form>
            ) : (
              <button type="button" onClick={() => setIsSaving(true)}>Save current filters</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
