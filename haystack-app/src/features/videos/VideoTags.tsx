import { useEffect, useRef, useState } from "react";
import type { VideoTag } from "../../state/types";
import type { Action } from "../../state/state";

interface VideoTagsProps {
  videoId: string;
  tags: VideoTag[];
  dispatch: React.ActionDispatch<[action: Action]>;
}

export function VideoTags(props: VideoTagsProps) {
  const [isAdding, setIsAdding] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAdding) inputRef.current?.focus();

  }, [isAdding]);

  function commitTag() {
    const tagName = inputRef.current?.value.trim() ?? "";

    if (tagName) {
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

  return (
    <div className="video-tags">
      {props.tags.map((tag) => (
        <button
          key={tag.name}
          type="button"
          className="video-tag"
          style={{ backgroundColor: tag.color }}
          onClick={() => props.dispatch({
            type: "UPDATE_TAGS_FOR_VIDEO",
            videoId: props.videoId,
            tagName: tag.name,
        })}
        >
          {tag.name}
        </button>
      ))}

      {isAdding ? (
        <input
          ref={inputRef}
          className="video-tag-input"
          type="text"
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