import { Link, useParams } from "react-router-dom";
import { getCreatorState, getVideoFilterState, type Action, type AppState } from "../state/state";
import { AllCreators } from "../state/types";
import { VideoGrid } from "../features/videos/VideoGrid";
import { CreatorActions } from "../features/creators/CreatorActions";
import { CreatorTags } from "../features/creators/CreatorTags";
import { AppRoutes } from "../features/nav/routes";
import { getChannelURL } from "../utils/creatorhelpers";
import { filterVideosForCreator } from "../utils/videohelpers";
import "./CreatorPage.css";
import "../features/videos/VideoGrid.css";

interface CreatorPageProps {
  state: AppState;
  dispatch: React.ActionDispatch<[action: Action]>;
}

export function CreatorPage({ state, dispatch }: CreatorPageProps) {
  const { creatorId } = useParams<{ creatorId: string }>();
  const creator = creatorId && Object.hasOwn(AllCreators, creatorId)
    ? AllCreators[creatorId]
    : undefined;

  if (!creator) {
    return (
      <main className="creator-page">
        <h1>Creator not found</h1>
        <Link to={AppRoutes.HOME}>Back to home</Link>
      </main>
    );
  }

  const filters = getVideoFilterState(state);
  const creatorState = getCreatorState(state, creator.ucid);
  let videoIds = filterVideosForCreator(
        creator.ucid,
        creatorState,
        filters,
        creator.videos,
        state.videoTagState
      );

  if (filters.inWatchLater || filters.inLove) {
    const selectedPlaylistIds = [
      ...(filters.inWatchLater ? ["watchlater"] : []),
      ...(filters.inLove ? ["love"] : []),
    ];
    const playlistVideoIds = new Set(selectedPlaylistIds.flatMap((id) =>
      (state.playlistStates[id]?.videoIds ?? [])
        .filter(([id]) => id === creator.ucid)
        .map(([, videoId]) => videoId)
    ));
    videoIds = videoIds.filter(([, videoId]) => playlistVideoIds.has(videoId));
  }

  return (
    <main className="creator-page">
      <header className="creator-page-header">
        <img src={creator.avatar.url} alt={creator.name} />
        <div>
          <h1>{creator.name}</h1>
          <p>{creator.handle}</p>
          <a href={getChannelURL(creator.ucid)} target="_blank" rel="noopener noreferrer">
            View YouTube channel
          </a>
          <CreatorActions creatorId={creator.ucid} creatorState={creatorState} dispatch={dispatch} />
        </div>
      </header>
      <CreatorTags key={creator.ucid} creatorId={creator.ucid} state={state} dispatch={dispatch} />
      <section aria-labelledby="creator-videos-heading">
        <h2 id="creator-videos-heading">Videos</h2>
        {videoIds.length === 0 ? <p>No videos match your current filters.</p> : (
          <VideoGrid
            state={state}
            dispatch={dispatch}
            videoIds={videoIds}
            displayCreator={false}
            maxColumns={4}
            maxRows={Math.ceil(videoIds.length / 4)}
          />
        )}
      </section>
    </main>
  );
}
