import { tagStyle } from "../../utils/taghelpers";
import { hasTag, sameTag } from "../../utils/taghelpers";
import { useEffect, useId, useRef, useState } from "react";
import type { VideoTag } from "../../state/types";
import type { Action } from "../../state/state";

interface VideoTagsProps {
  videoId: string;
  tags: VideoTag[];
  allTags: VideoTag[];
  activeFilterTags?: string[];
  onToggleTagFilter?: (tagName: string) => void;
  dispatch: React.ActionDispatch<[action: Action]>;
}

export function VideoTags(props: VideoTagsProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [query, setQuery] = useState("");
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsId = useId();

  useEffect(() => {
    if (isAdding) inputRef.current?.focus();
  }, [isAdding]);

  const suggestions = props.allTags
    .filter((tag) => !props.tags.some((selected) => sameTag(selected.name, tag.name)))
    .filter((tag) => tag.name.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  function commitTag(value?: string) {
    const tagName = (value ?? inputRef.current?.value ?? "").trim();

    if (tagName && !props.tags.some((tag) => sameTag(tag.name, tagName))) {
        props.dispatch({
            type: "ADD_NEW_VIDEO_TAG",
            tagName,
        });
        props.dispatch({
            type: "UPDATE_TAGS_FOR_VIDEO",
            videoId: props.videoId,
            tagName,
        });
    }

    // Clear synchronously so Enter followed by blur can't add twice.
    if (inputRef.current) inputRef.current.value = "";

    setQuery("");
    setActiveSuggestion(-1);
    setIsAdding(false);
  }

  function cancelTag() {
    if (inputRef.current) inputRef.current.value = "";
    setQuery("");
    setActiveSuggestion(-1);
    setIsAdding(false);
  }


  return (
    <div className="video-tags">
      {props.tags.map((tag) => (
        <span
          key={tag.name}
          className="video-tag video-tag-chip"
          style={tagStyle(tag)}
        >
          {props.onToggleTagFilter ? (
            <button
              type="button"
              className="video-tag-filter"
              aria-pressed={hasTag(props.activeFilterTags ?? [], tag.name)}
              title={`${hasTag(props.activeFilterTags ?? [], tag.name) ? "Remove" : "Apply"} ${tag.name} filter`}
              onClick={() => props.onToggleTagFilter?.(tag.name)}
            >
              {tag.emoji && `${tag.emoji} `}{tag.name}
            </button>
          ) : <>{tag.emoji && `${tag.emoji} `}{tag.name}</>}
          <button
            type="button"
            className="video-tag-remove"
            aria-label={`Remove video tag ${tag.name}`}
            title="Remove from this video"
            onClick={() => props.dispatch({
              type: "UPDATE_TAGS_FOR_VIDEO",
              videoId: props.videoId,
              tagName: tag.name,
            })}
          >×</button>
        </span>
      ))}

      {isAdding ? (
        <div className="video-tag-editor">
        <input
          ref={inputRef}
          className="video-tag-input video-tag-autocomplete"
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={suggestions.length > 0}
          aria-controls={suggestionsId}
          aria-activedescendant={activeSuggestion >= 0 ? `${suggestionsId}-${activeSuggestion}` : undefined}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveSuggestion(-1);
          }}
          autoComplete="off"
          placeholder="Tag name…"
          aria-label="New tag name"
          onKeyDown={(event) => {
            if ((event.key === "ArrowDown" || event.key === "ArrowUp") && suggestions.length > 0) {
              event.preventDefault();
              setActiveSuggestion((index) => event.key === "ArrowDown"
                ? (index + 1) % suggestions.length
                : (index <= 0 ? suggestions.length : index) - 1);
            }
            if (event.key === "Enter") {
              event.preventDefault();
              commitTag(suggestions[activeSuggestion]?.name);
            }

            if (event.key === "Escape") cancelTag();
          }}
          onBlur={() => commitTag()}
        />
        {suggestions.length > 0 && (
          <div id={suggestionsId} className="video-tag-suggestions" role="listbox" aria-label="Suggested tags">
            {suggestions.map((tag, index) => (
              <button
                key={tag.name}
                id={`${suggestionsId}-${index}`}
                type="button"
                role="option"
                aria-selected={index === activeSuggestion}
                className="video-tag-suggestion"
                onPointerDown={(event) => event.preventDefault()}
                onClick={() => commitTag(tag.name)}
                tabIndex={-1}
              >
                {tag.emoji && `${tag.emoji} `}{tag.name}
              </button>
            ))}
          </div>
        )}
        </div>
      ) : (
        <button
          type="button"
          className="video-tag-add"
          aria-label="Add a tag"
          title="Add a tag"
          onClick={() => setIsAdding(true)}
        >
          +
        </button>
      )}
    </div>
  );
}
