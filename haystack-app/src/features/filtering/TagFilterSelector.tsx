
import { useEffect, useRef, useState } from "react";
import type { VideoTagState } from "../../state/state";

interface TagFilterSelectorProps {
  selectedTagNames: string[];
  tagsState: VideoTagState;
  onTagsChanged: (tagNames: string[]) => void;
}

export function TagFilterSelector(props: TagFilterSelectorProps) {
  const [isAdding, setIsAdding] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAdding) inputRef.current?.focus();
  }, [isAdding]);

  function commitTag() {
    const tagName = inputRef.current?.value.trim() ?? "";

    if (tagName && !props.selectedTagNames.includes(tagName)) {
      props.onTagsChanged([...props.selectedTagNames, tagName]);
    }

    if (inputRef.current) inputRef.current.value = "";
    setIsAdding(false);
  }

  function cancelTag() {
    if (inputRef.current) inputRef.current.value = "";
    setIsAdding(false);
  }

  return (
    <div className="video-tags">
      {props.selectedTagNames.map((tagName) => {
        const tag = props.tagsState.allTags[tagName];

        return (
          <button
            key={tagName}
            type="button"
            className="video-tag"
            style={{ backgroundColor: tag?.color ?? "#cccccc" }}
            onClick={() => {
              props.onTagsChanged(
                props.selectedTagNames.filter((name) => name !== tagName)
              );
            }}
          >
            {tagName}
          </button>
        );
      })}

      {isAdding ? (
        <input
          ref={inputRef}
          className="video-tag-input"
          type="text"
          placeholder="Tag name…"
          aria-label="Add a tag filter"
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              commitTag();
            }

            if (event.key === "Escape") cancelTag();
          }}
          onBlur={commitTag}
        />
      ) : (
        <button
          type="button"
          className="video-tag-add"
          aria-label="Add a tag filter"
          title="Add a tag filter"
          onClick={() => setIsAdding(true)}
        >
          +
        </button>
      )}
    </div>
  );
}
