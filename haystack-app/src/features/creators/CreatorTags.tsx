import { tagStyle } from "../../utils/taghelpers";
import { hasTag } from "../../utils/taghelpers";
import { useId, useState } from "react";
import type { Action, AppState } from "../../state/state";
import "../videos/VideoTags.css";

interface CreatorTagsProps {
  creatorId: string;
  state: AppState;
  dispatch: React.ActionDispatch<[action: Action]>;
}

export function CreatorTags({ creatorId, state, dispatch }: CreatorTagsProps) {
  const [tagName, setTagName] = useState("");
  const suggestionsId = useId();
  const tags = state.creatorStates[creatorId]?.tags ?? [];

  return (
    <section className="creator-page-tags" aria-label="Creator tags">
      <div className="video-tags">
        {tags.map((name) => (
          <button
            key={name}
            type="button"
            className="video-tag"
            style={tagStyle(state.videoTagState.allTags[name])}
            aria-label={`Remove creator tag ${name}`}
            title={`Remove ${name}`}
            onClick={() => dispatch({ type: "REMOVE_CREATOR_TAG", creatorId, tagName: name })}
          >
            {state.videoTagState.allTags[name]?.emoji && `${state.videoTagState.allTags[name].emoji} `}{name} ×
          </button>
        ))}
      <form className="creator-tag-add-form" onSubmit={(event) => {
        event.preventDefault();
        if (!tagName.trim()) return;
        dispatch({ type: "ADD_CREATOR_TAG", creatorId, tagName });
        setTagName("");
      }}>
        <input
          className="video-tag-input video-tag-autocomplete"
          aria-label="Add a creator tag"
          value={tagName}
          onChange={(event) => setTagName(event.target.value)}
          onKeyDown={(event) => { if (event.key === "Escape") setTagName(""); }}
          list={suggestionsId}
          placeholder="Add tag…"
        />
        <datalist id={suggestionsId}>
          {Object.keys(state.videoTagState.allTags)
            .filter((name) => !hasTag(tags, name))
            .map((name) => <option key={name} value={name}>{state.videoTagState.allTags[name]?.emoji && `${state.videoTagState.allTags[name].emoji} `}{name}</option>)}
        </datalist>
      </form>
      </div>
    </section>
  );
}
