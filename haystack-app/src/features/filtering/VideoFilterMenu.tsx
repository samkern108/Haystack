import { EmojiPicker } from "../tags/EmojiPicker";
import { useState, type CSSProperties } from "react";

import "./VideoFilterMenu.scss";
import { TimeFilterSelector } from "./TimeFilterSelector";
import { matchesFilterPreset, type Action, type FilterPreset, type CreatorState, type VideoFilterState, type VideoTagState } from "../../state/state";
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
  const [presetColor, setPresetColor] = useState("#8bbde0");
  const [presetEmoji, setPresetEmoji] = useState("");

  const matchesExistingPreset = props.filterPresets.some((preset) => matchesFilterPreset(props.videoFilterState, preset.filters));

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
        </div>
          <div className="filter-presets" role="group" aria-label="Saved filters">
            {props.filterPresets.map((preset, index) => (
              <div key={preset.id} className="filter-tab">
              <button
                type="button"
                className="filter-preset"
                style={{ "--preset-color": preset.color ?? ["#8bbde0", "#e8a5b4", "#b5c98b", "#eac278", "#bba5dc"][index % 5] } as CSSProperties}
                aria-pressed={props.activeFilterPresetId === preset.id}
                onClick={() => props.dispatch({ type: "TOGGLE_FILTER_PRESET", id: preset.id })}
              >
                {preset.emoji && <span aria-hidden="true">{preset.emoji} </span>}{preset.name}
              </button>
              {props.activeFilterPresetId === preset.id && (
                <>
                  <OverwriteFilterButton key={JSON.stringify(props.videoFilterState)} name={preset.name}
                    hasChanges={!matchesFilterPreset(props.videoFilterState, preset.filters)}
                    onSave={() => props.dispatch({ type: "OVERWRITE_FILTER_PRESET", id: preset.id })} />
                  <DeleteFilterButton name={preset.name} onDelete={() => props.dispatch({ type: "DELETE_FILTER_PRESET", id: preset.id })} />
                </>
              )}
              </div>
            ))}
            {!matchesExistingPreset && (isSaving ? (
              <form className="filter-tab-editor" aria-label="Save filter preset" onSubmit={(event) => {
                event.preventDefault();
                if (!presetName.trim()) return;
                props.dispatch({ type: "SAVE_FILTER_PRESET", id: crypto.randomUUID(), name: presetName, color: presetColor, emoji: presetEmoji });
                setPresetName("");
                setPresetEmoji("");
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
                <input type="color" className="filter-tab-color" aria-label="Filter tab color" title="Tab color" value={presetColor} onChange={(event) => setPresetColor(event.target.value)} />
                <EmojiPicker tagName="filter tab" value={presetEmoji} onChange={setPresetEmoji} />
                <button type="submit" className="filter-save-icon" aria-label="Save filter" title="Save filter" disabled={!presetName.trim()}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 3h13l4 4v14H3V3Z" />
                    <path d="M7 3v6h9V3M7 21v-8h10v8M13 4v3" />
                  </svg>
                </button>
                <button type="button" className="filter-save-icon" aria-label="Cancel saving filter" title="Cancel" onClick={() => { setIsSaving(false); setPresetName(""); setPresetEmoji(""); }}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <path d="m6 6 12 12M18 6 6 18" />
                  </svg>
                </button>
              </form>
            ) : (
              <button type="button" className="filter-tab-add" onClick={() => setIsSaving(true)}>＋ New filter preset</button>
            ))}
          </div>
    </section>
  );
}

function DeleteFilterButton({ name, onDelete }: { name: string; onDelete: () => void }) {
  const [confirming, setConfirming] = useState(false);
  return (
    <button type="button" className={`filter-tab-delete${confirming ? " confirming" : ""}`}
      aria-label={confirming ? `Confirm deletion of ${name}` : `Delete saved filter ${name}`}
      title={confirming ? "Click again to delete saved filter" : "Delete saved filter"}
      onBlur={() => setConfirming(false)}
      onKeyDown={(event) => { if (event.key === "Escape") setConfirming(false); }}
      onClick={() => { if (confirming) onDelete(); else setConfirming(true); }}>
      ×
    </button>
  );
}

function OverwriteFilterButton({ name, hasChanges, onSave }: { name: string; hasChanges: boolean; onSave: () => void }) {
  const [confirming, setConfirming] = useState(false);
  return (
    <button type="button" className={`filter-tab-overwrite${hasChanges ? " unsaved" : ""}${confirming ? " confirming" : ""}`}
      aria-label={confirming ? `Confirm overwrite of ${name}` : `Overwrite saved filter ${name}`}
      title={confirming ? "Click again to overwrite saved filter" : hasChanges ? "Unsaved changes — click to save" : "Overwrite with current filters"}
      onBlur={() => setConfirming(false)}
      onKeyDown={(event) => { if (event.key === "Escape") setConfirming(false); }}
      onClick={() => {
        if (confirming) { onSave(); setConfirming(false); }
        else setConfirming(true);
      }}>
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 3h13l4 4v14H3V3Z" />
        <path d="M7 3v6h9V3M7 21v-8h10v8M13 4v3" />
      </svg>
    </button>
  );
}
