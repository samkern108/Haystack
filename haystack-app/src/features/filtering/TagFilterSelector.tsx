import { tagGroupingRanges, tagOperator, type TagOperator } from "../../utils/tagfilterlogic";
import { hasTag, sameTag, tagStyle } from "../../utils/taghelpers";

import { Fragment, useEffect, useRef, useState } from "react";
import { getVideoCountForTag, type CreatorState, type VideoTagState } from "../../state/state";

interface TagFilterSelectorProps {
  selectedTagNames: string[];
  operators?: TagOperator[];
  operatorOrder?: number[];
  onOperatorsChanged?: (operators: TagOperator[], order: number[]) => void;
  tagsState: VideoTagState;
  creatorStates: Record<string, CreatorState>;
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
        !hasTag(props.selectedTagNames, tagName)
      )
    : [];

  function selectTag(tagName: string) {
    // Only select tags that actually exist.
    if (!props.tagsState.allTags[tagName]) return;

    if (!hasTag(props.selectedTagNames, tagName)) {
      props.onTagsChanged([...props.selectedTagNames, tagName]);
    }

    setQuery("");
    setActiveSuggestion(0);
    setIsAdding(false);
  }

  function removeTag(tagName: string) {
    props.onTagsChanged(
      props.selectedTagNames.filter((name) => !sameTag(name, tagName))
    );
  }

  function closeSelector() {
    setIsAdding(false);
    setQuery("");
    setActiveSuggestion(0);
  }

  const ranges = props.onOperatorsChanged
    ? tagGroupingRanges(props.selectedTagNames, props.operators, props.operatorOrder) : [];

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
        {props.selectedTagNames.map((tagName, index) => {
          const tag = props.tagsState.allTags[tagName];

          const before = tagOperator(props.operators, index - 1);
          return (
            <Fragment key={tagName}>
            {index > 0 && props.onOperatorsChanged && (
              <button type="button" className="tag-filter-operator"
                aria-label={`${before.toUpperCase()} between ${props.selectedTagNames[index - 1]} and ${tagName}; click to use ${before === "and" ? "OR" : "AND"}`}
                onClick={() => {
                  const operators = props.selectedTagNames.slice(1).map((_, i) => tagOperator(props.operators, i));
                  operators[index - 1] = before === "and" ? "or" : "and";
                  props.onOperatorsChanged?.(operators, [index - 1, ...(props.operatorOrder ?? []).filter((i) => i !== index - 1)]);
                }}>{before.toUpperCase()}</button>
            )}
            {ranges.filter(([start]) => start === index).map((_, i) => (
              <span key={i} className="tag-filter-parenthesis">(</span>
            ))}
            <button
              type="button"
              className="video-tag"
              style={{ ...tagStyle(tag), backgroundColor: tag?.color ?? "#cccccc" }}
              onClick={() => removeTag(tagName)}
              title={`Remove ${tagName}`}
            >
              {tag?.emoji && `${tag.emoji} `}{tagName} ×
            </button>
            {ranges.filter(([, end]) => end === index).map((_, i) => (
              <span key={i} className="tag-filter-parenthesis">)</span>
            ))}
            </Fragment>
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
                        style={tag.isCollection ? { ...tagStyle(tag), backgroundColor: undefined } : undefined}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => selectTag(tagName)}
                        >
                        <span
                            className="tag-suggestion-color"
                            style={{ backgroundColor: tag.color }}
                        />
                        <span>{tag.emoji && `${tag.emoji} `}{tagName}</span>
                        <span className="tag-suggestion-count">
                            ({getVideoCountForTag(tagName, props.tagsState, props.creatorStates)})
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
