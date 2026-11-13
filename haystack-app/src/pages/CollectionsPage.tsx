import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { type Action, type AppState } from "../state/state";
import { AllCreators } from "../state/types";
import { tagStyle } from "../utils/taghelpers";
import { filterVideoIdsByIncludedTags } from "../utils/videohelpers";
import { VideoGrid } from "../features/videos/VideoGrid";
import { AppRoutes } from "../features/nav/routes";
import "./CollectionsPage.css";

interface CollectionsPageProps {
  state: AppState;
  dispatch: React.ActionDispatch<[action: Action]>;
}

export function CollectionsPage({ state, dispatch }: CollectionsPageProps) {
  const [query, setQuery] = useState("");
  const [params] = useSearchParams();
  const selectedName = params.get("tag");
  const collections = Object.values(state.videoTagState.allTags)
    .filter((tag) => tag.isCollection)
    .sort((a, b) => a.name.localeCompare(b.name));
  const selected = collections.find((tag) => tag.name === selectedName);

  function videosFor(name: string): [string, string][] {
    return Object.values(AllCreators).flatMap((creator) =>
      filterVideoIdsByIncludedTags(
        Object.keys(creator.videos), [name], state.videoTagState, state.creatorStates[creator.ucid]
      ).map((videoId): [string, string] => [creator.ucid, videoId])
    );
  }

  if (selectedName !== null) {
    const videos = selected ? videosFor(selected.name) : [];
    return (
      <main className="collections-page">
        <Link to={AppRoutes.COLLECTIONS}>← All collections</Link>
        {selected ? <>
          <h1><span className="collection-title" style={tagStyle(selected)}>{selected.emoji} {selected.name}</span></h1>
          <p>{videos.length} videos</p>
          {videos.length > 0 ? (
            <VideoGrid state={state} dispatch={dispatch} videoIds={videos} displayCreator maxColumns={3} maxRows={Math.ceil(videos.length / 3)} />
          ) : <p>No videos in this collection yet. Apply this tag to a video or creator to add videos.</p>}
        </> : <h1>Collection not found</h1>}
      </main>
    );
  }

  const matching = collections.filter((tag) => tag.name.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  return (
    <main className="collections-page">
      <h1>Collections</h1>
      <p>Browse videos grouped by collection tags. Mark a tag as a Collection on the <Link to={AppRoutes.TAGS}>Tags page</Link>.</p>
      <input type="search" aria-label="Search collections" placeholder="Search collections…" value={query} onChange={(event) => setQuery(event.target.value)} />
      {collections.length === 0 ? <p>No collections yet.</p> : matching.length === 0 ? <p>No matching collections.</p> : (
        <ul className="collection-list">
          {matching.map((tag) => (
            <li key={tag.name}>
              <Link className="collection-card" style={tagStyle(tag)} to={`${AppRoutes.COLLECTIONS}?tag=${encodeURIComponent(tag.name)}`}>
                <strong>{tag.emoji} {tag.name}</strong>
                <span>{videosFor(tag.name).length} videos</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
