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
  const inputId = useId();
  const tags = state.creatorStates[creatorId]?.tags ?? [];

  return (
    <section className="creator-page-tags" aria-label="Creator tags">
      <h2>Creator tags</h2>
      <div className="video-tags">
        {tags.map((name) => (
          <button
            key={name}
            type="button"
            className="video-tag"
            style={{ backgroundColor: state.videoTagState.allTags[name]?.color }}
            aria-label={`Remove creator tag ${name}`}
            title={`Remove ${name}`}
            onClick={() => dispatch({ type: "REMOVE_CREATOR_TAG", creatorId, tagName: name })}
          >
            {name} ×
          </button>
        ))}
      </div>
      <form onSubmit={(event) => {
        event.preventDefault();
        if (!tagName.trim()) return;
        dispatch({ type: "ADD_CREATOR_TAG", creatorId, tagName });
        setTagName("");
      }}>
        <label htmlFor={inputId}>Add a creator tag</label>
        <input
          id={inputId}
          value={tagName}
          onChange={(event) => setTagName(event.target.value)}
          onKeyDown={(event) => { if (event.key === "Escape") setTagName(""); }}
          list={suggestionsId}
          placeholder="Choose or create a tag…"
        />
        <datalist id={suggestionsId}>
          {Object.keys(state.videoTagState.allTags)
            .filter((name) => !tags.includes(name))
            .map((name) => <option key={name} value={name} />)}
        </datalist>
        <button type="submit" disabled={!tagName.trim()}>Add tag</button>
      </form>
    </section>
  );
}
