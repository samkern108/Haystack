
import { useEffect, useRef, useState } from "react";
import { getVideoCountForTag, type VideoTagState } from "../../state/state";

interface TagFilterSelectorProps {
  selectedTagNames: string[];
  tagsState: VideoTagState;
  onTagsChanged: (tagNames: string[]) => void;
}

export function TagFilterSelector(props: TagFilterSelectorProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [query, setQuery] = useState("");
  const [activeSuggestion, setActiveSuggestion] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAdding) inputRef.current?.focus();
  }, [isAdding]);

  // Find existing tags matching the input.
  const suggestions = query.trim()
    ? Object.keys(props.tagsState.allTags).filter((tagName) =>
        tagName.toLowerCase().startsWith(query.trim().toLowerCase()) &&
        !props.selectedTagNames.includes(tagName)
      )
    : [];

  function selectTag(tagName: string) {
    // Only select tags that actually exist.
    if (!props.tagsState.allTags[tagName]) return;

    if (!props.selectedTagNames.includes(tagName)) {
      props.onTagsChanged([...props.selectedTagNames, tagName]);
    }

    setQuery("");
    setActiveSuggestion(0);
    setIsAdding(false);
  }

  function removeTag(tagName: string) {
    props.onTagsChanged(
      props.selectedTagNames.filter((name) => name !== tagName)
    );
  }

  function closeSelector() {
    setIsAdding(false);
    setQuery("");
    setActiveSuggestion(0);
  }

  return (
    <div
      className="tag-filter-selector"
      ref={containerRef}
      onBlur={(event) => {
        // Close only when focus leaves the entire selector.
        if (
          !containerRef.current?.contains(
            event.relatedTarget as Node | null
          )
        ) {
          closeSelector();
        }
      }}
    >
      <div className="video-tags">
        {props.selectedTagNames.map((tagName) => {
          const tag = props.tagsState.allTags[tagName];

          return (
            <button
              key={tagName}
              type="button"
              className="video-tag"
              style={{
                backgroundColor: tag?.color ?? "#cccccc",
              }}
              onClick={() => removeTag(tagName)}
              title={`Remove ${tagName}`}
            >
              {tagName} ×
            </button>
          );
        })}

        {!isAdding && (
          <button
            type="button"
            className="video-tag-add"
            aria-label="Add a tag filter"
            onClick={() => setIsAdding(true)}
          >
            +
          </button>
        )}

        {isAdding && (
          <div className="tag-autocomplete">
            <input
              ref={inputRef}
              className="video-tag-input"
              type="text"
              value={query}
              placeholder="Search tags…"
              aria-label="Search existing tags"
              autoComplete="off"
              onChange={(event) => {
                setQuery(event.target.value);
                setActiveSuggestion(0);
              }}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  event.preventDefault();
                  closeSelector();
                  return;
                }

                if (event.key === "ArrowDown" && suggestions.length > 0) {
                  event.preventDefault();
                  setActiveSuggestion((index) =>
                    (index + 1) % suggestions.length
                  );
                  return;
                }

                if (event.key === "ArrowUp" && suggestions.length > 0) {
                  event.preventDefault();
                  setActiveSuggestion((index) =>
                    (index - 1 + suggestions.length) % suggestions.length
                  );
                  return;
                }

                if (event.key === "Enter") {
                  event.preventDefault();

                  if (suggestions.length > 0) {
                    selectTag(suggestions[activeSuggestion]);
                  }
                }
              }}
            />

            {query.trim() !== "" && (
              <div className="tag-suggestions" role="listbox">
                {suggestions.length > 0 ? (
                  suggestions.map((tagName, index) => {
                    const tag = props.tagsState.allTags[tagName];

                    return (
                        <button
                        key={tagName}
                        type="button"
                        role="option"
                        aria-selected={index === activeSuggestion}
                        className={
                            index === activeSuggestion
                            ? "tag-suggestion active"
                            : "tag-suggestion"
                        }
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => selectTag(tagName)}
                        >
                        <span
                            className="tag-suggestion-color"
                            style={{ backgroundColor: tag.color }}
                        />
                        <span>{tagName}</span>
                        <span className="tag-suggestion-count">
                            ({getVideoCountForTag(tagName, props.tagsState)})
                        </span>
                        </button>
                    );
                  })
                ) : (
                  <div className="tag-suggestions-empty">
                    No matching tags
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
