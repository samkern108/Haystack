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
    <section className="persistent-video-filters" aria-label="Video filters">
        <div className="video-filter-menu persistent-filter-menu">
          <div className="video-filter-row inline">
            <button
              className="video-filter-toggle"
              onClick={cycleCreatorFilter}
            >
              {props.videoFilterState.creator === "all" ? "All Creators"
                : props.videoFilterState.creator === "followed" ? "Followed Creators" : "Unfollowed Creators"}
            </button>
          </div>

          <div className="video-filter-row inline">
            <button
              className="video-filter-toggle"
              onClick={cycleWatchedFilter}
            >
              {props.videoFilterState.watched === "all" ? "All Videos"
                : props.videoFilterState.watched === "yes" ? "Watched Videos" : "Unwatched Videos"}
            </button>
          </div>

          <div className="video-filter-row" role="group" aria-label="Video duration">
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
                <button type="submit" className="filter-save-icon" aria-label="Save filter" title="Save filter" disabled={!presetName.trim()}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 3h13l4 4v14H3V3Z" />
                    <path d="M7 3v6h9V3M7 21v-8h10v8M13 4v3" />
                  </svg>
                </button>
                <button type="button" className="filter-save-icon" aria-label="Cancel saving filter" title="Cancel" onClick={() => { setIsSaving(false); setPresetName(""); }}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <path d="m6 6 12 12M18 6 6 18" />
                  </svg>
                </button>
              </form>
            ) : (
              <button type="button" onClick={() => setIsSaving(true)}>Save current filters</button>
            )}
          </div>
        </div>
    </section>
  );
}
