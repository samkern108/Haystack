import { EmojiPicker } from "../features/tags/EmojiPicker";
import { Link } from "react-router-dom";
import { AppRoutes } from "../features/nav/routes";
import { sameTag, tagStyle } from "../utils/taghelpers";
import { useState } from "react";
import { getVideoCountForTag, type Action, type AppState } from "../state/state";
import "./TagsPage.css";

interface TagsPageProps {
  state: AppState;
  dispatch: React.ActionDispatch<[action: Action]>;
}

export function TagsPage({ state, dispatch }: TagsPageProps) {
  const [query, setQuery] = useState("");
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null);
  const [sort, setSort] = useState("name");
  const [editing, setEditing] = useState<{ source: string; mode: "rename" | "merge" } | null>(null);
  const [target, setTarget] = useState("");
  const [message, setMessage] = useState("");
  const counts = Object.fromEntries(Object.keys(state.videoTagState.allTags).map((name) =>
    [name, getVideoCountForTag(name, state.videoTagState, state.creatorStates)]
  ));
  const names = Object.keys(state.videoTagState.allTags).sort((a, b) => {
    const usage = sort === "most" ? counts[b] - counts[a]
      : sort === "least" ? counts[a] - counts[b] : 0;
    return usage || a.localeCompare(b);
  });
  const trimmed = target.trim();
  const exists = names.some((name) => name !== editing?.source && sameTag(name, trimmed));
  const valid = editing && trimmed && trimmed !== editing.source && (editing.mode === "merge" ? exists : !exists);

  function begin(source: string, mode: "rename" | "merge") {
    setConfirmRemove(null);
    setEditing({ source, mode });
    setTarget(mode === "rename" ? source : "");
    setMessage("");
  }

  function saveRename() {
    if (!editing || editing.mode !== "rename" || !valid) return;
    dispatch({ type: "RENAME_TAG", source: editing.source, target: trimmed });
    setMessage(`Renamed ${editing.source} to ${trimmed}.`);
    setEditing(null);
  }

  return (
    <main className="tags-page">
      <h1>Tags</h1>
      <p>Rename tags or merge one into another. Changes apply to videos, creators, and saved filters. Choose an optional emoji for special tags such as awards.</p>
      <input aria-label="Search tags" placeholder="Search tags…" value={query} onChange={(event) => setQuery(event.target.value)} />
      <label className="tag-sort">
        Sort by {" "}
        <select value={sort} onChange={(event) => setSort(event.target.value)}>
          <option value="name">Name</option>
          <option value="most">Most used</option>
          <option value="least">Least used</option>
        </select>
      </label>
      <p role="status">{message}</p>
      {names.length === 0 && <p>No tags yet. Add tags to a video or creator to get started.</p>}
      {names.length > 0 && !names.some((name) => name.toLowerCase().includes(query.toLowerCase())) && <p>No matching tags.</p>}
      <ul>
        {names.filter((name) => name.toLowerCase().includes(query.toLowerCase())).map((name) => (
          <li key={name}>
            <div className="tag-management-row">
              <span className="tag-management-color" style={tagStyle(state.videoTagState.allTags[name])} />
              {editing?.source === name && editing.mode === "rename" ? (
                <input
                  autoFocus
                  aria-label={`New name for ${name}`}
                  aria-invalid={Boolean(trimmed !== name && exists)}
                  value={target}
                  onChange={(event) => setTarget(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") { event.preventDefault(); saveRename(); }
                    if (event.key === "Escape") setEditing(null);
                  }}
                />
              ) : (
                <strong>{state.videoTagState.allTags[name].emoji && `${state.videoTagState.allTags[name].emoji} `}{name}</strong>
              )}
              <span>{counts[name]} videos</span>
              <label>
                <input type="checkbox" checked={Boolean(state.videoTagState.allTags[name].isCollection)}
                  onChange={(event) => dispatch({ type: "SET_TAG_COLLECTION", tagName: name, isCollection: event.target.checked })} />
                Collection
              </label>
              {state.videoTagState.allTags[name].isCollection && (
                <Link to={`${AppRoutes.COLLECTIONS}?tag=${encodeURIComponent(name)}`}>View collection</Link>
              )}
              <EmojiPicker
                tagName={name}
                value={state.videoTagState.allTags[name].emoji}
                onChange={(emoji) => dispatch({ type: "SET_TAG_EMOJI", tagName: name, emoji })}
              />
              {editing?.source === name && editing.mode === "rename" ? (
                <>
                  <button type="button" disabled={!valid} onClick={saveRename}>Save</button>
                  <button type="button" onClick={() => setEditing(null)}>Cancel</button>
                </>
              ) : (
                <button type="button" onClick={() => begin(name, "rename")}>Rename</button>
              )}
              <button type="button" disabled={names.length < 2} onClick={() => begin(name, "merge")}>Merge</button>
              <button type="button" onClick={() => {
                if (confirmRemove !== name) {
                  setConfirmRemove(name);
                  return;
                }
                dispatch({ type: "REMOVE_TAG", tagName: name });
                setConfirmRemove(null);
                if (editing?.source === name) setEditing(null);
                setMessage(`Removed ${name} from videos, creators, and saved filters.`);
              }}>
                {confirmRemove === name ? "Are you sure?" : "Remove tag"}
              </button>
              {confirmRemove === name && (
                <button type="button" onClick={() => setConfirmRemove(null)}>Cancel removal</button>
              )}
            </div>
            {editing?.source === name && editing.mode === "rename" && trimmed !== name && exists && (
              <p role="alert">A tag with this name already exists. Use Merge to combine them.</p>
            )}
            {editing?.source === name && editing.mode === "merge" && (
              <form onSubmit={(event) => {
                event.preventDefault();
                if (!valid) return;
                dispatch({ type: "MERGE_TAG", source: name, target: trimmed });
                setMessage(`Merged ${name} into ${trimmed}.`);
                setEditing(null);
              }}>
                <label>
                  Merge into {" "}
                  <select autoFocus value={target} onChange={(event) => setTarget(event.target.value)} required>
                    <option value="">Choose a tag</option>
                    {names.filter((other) => other !== name).map((other) => <option key={other} value={other}>{state.videoTagState.allTags[other].emoji && `${state.videoTagState.allTags[other].emoji} `}{other}</option>)}
                  </select>
                </label>
                {editing.mode === "merge" && <p>This combines assignments into the selected tag and removes “{name}”. The selected tag keeps its color.</p>}
                <button type="submit" disabled={!valid}>Merge tags</button>
                <button type="button" onClick={() => setEditing(null)}>Cancel</button>
              </form>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
