import { sameTag } from "../../utils/taghelpers";
import { useEffect, useId, useRef, useState } from "react";
import type { VideoTag } from "../../state/types";
import type { Action } from "../../state/state";

interface VideoTagsProps {
  videoId: string;
  tags: VideoTag[];
  allTags: VideoTag[];
  dispatch: React.ActionDispatch<[action: Action]>;
}

export function VideoTags(props: VideoTagsProps) {
  const [isAdding, setIsAdding] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsId = useId();

  useEffect(() => {
    if (isAdding) inputRef.current?.focus();
  }, [isAdding]);

  function commitTag() {
    const tagName = inputRef.current?.value.trim() ?? "";

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

    setIsAdding(false);
  }

  function cancelTag() {
    if (inputRef.current) inputRef.current.value = "";
    setIsAdding(false);
  }

  console.log('tags ' + props.tags.length);

  return (
    <div className="video-tags">
      {props.tags.map((tag) => (
        <span
          key={tag.name}
          className="video-tag video-tag-chip"
          style={{ backgroundColor: tag.color }}
        >
          {tag.emoji && `${tag.emoji} `}{tag.name}
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
        <>
        <input
          ref={inputRef}
          className="video-tag-input video-tag-autocomplete"
          type="text"
          list={suggestionsId}
          autoComplete="off"
          placeholder="Tag name…"
          aria-label="New tag name"
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              commitTag();
            }

            if (event.key === "Escape") cancelTag();
          }}
          onBlur={commitTag}
        />
        <datalist id={suggestionsId}>
          {props.allTags
            .filter((tag) => !props.tags.some((selected) => sameTag(selected.name, tag.name)))
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((tag) => (
              <option key={tag.name} value={tag.name}>
                {tag.emoji && `${tag.emoji} `}{tag.name}
              </option>
            ))}
        </datalist>
        </>
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
