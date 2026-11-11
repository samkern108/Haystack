import { getCreatorState, getVideoFilterState, type Action, type AppState } from "../state/state";
import { TestButton } from "../features/ui/TestButton";
import { AllCreators, type Creator } from "../state/types";
import { CreatorRow } from "../features/creators/CreatorRow";
import { use, useEffect, useMemo, useRef, useState } from "react";
import { filterVideosForCreator, filterVideosFromPlaylist } from "../utils/videohelpers";
import { VideoGrid } from "../features/videos/VideoGrid";
import { shuffleCreators } from "../utils/creatorhelpers";
import "../features/videos/VideoGrid.css";

interface HomePageProps {
  state: AppState;
  dispatch: React.ActionDispatch<[action: Action]>;
}

export function HomePage(props: HomePageProps) {

  // SCROLL LOGIC
  // Load more creators when the user scrolls near the end of the page.
  const loadThreshold = 0.8;
  const [loadAmount, setLoadAmount] = useState(10);
  const lastLoadHeight = useRef(0);

  const filters = getVideoFilterState(props.state);
  const maxColumns = 4;
  const maxRows = 3;
  const maxVideos = maxColumns * maxRows;

  // TODO(sam): Refresh in place when filters change.

  // Remove creators based on the user's defined filters.
  // Also, pre-shuffle the creators so we don't always show them in the same order.
  const creatorsList: Creator[] = useMemo(
    () => shuffleCreators(Object.values(AllCreators)).filter(creator => {
      const creatorState = props.state.creatorStates[creator.ucid];
      if (props.state.videoFilterStates.creator === "unfollowed") return !creatorState.followed;
      if (props.state.videoFilterStates.creator === "followed") return creatorState.followed;
      console.log("running filter for creator " + creator.name);

      return true;
  }), []); // TODO(sam): Are there any instances on which this should recompute?

  const videoIdsFromPlaylist = useMemo(() => {
    const selectedPlaylistIds = [
      ...(filters.inWatchLater ? ["watchlater"] : []),
      ...(filters.inLove ? ["love"] : []),
    ];
    const seen = new Set<string>();
    const playlistVideoIds = selectedPlaylistIds
      .flatMap((id) => props.state.playlistStates[id]?.videoIds ?? [])
      .filter(([creatorId, videoId]) => {
        const key = JSON.stringify([creatorId, videoId]);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    const filteredVideoIds = filterVideosFromPlaylist(
      playlistVideoIds,
      props.state.creatorStates,
      filters,
      props.state.videoTagState
    );

    return filteredVideoIds;
  }, [props.state.playlistStates, props.state.creatorStates, filters, props.state.videoTagState]);

  const videoIdsFromAllCreators = useMemo(() => {
    let ids = [] as [creatorId: string, videoId: string][];

    creatorsList.forEach((creator) => {
      ids = ids.concat(
        filterVideosForCreator(
          creator.ucid,
          getCreatorState(props.state, creator.ucid),
          filters,
          creator.videos,
          props.state.videoTagState,
          1
        )
      );
    });

    // Keep one video per creator first, then fill any remaining slots
    // with additional matching videos from those creators, one per round.
    if (ids.length < maxVideos) {
      const remainingByCreator = ids.map(([creatorId]) =>
        filterVideosForCreator(
          creatorId,
          getCreatorState(props.state, creatorId),
          filters,
          AllCreators[creatorId].videos,
          props.state.videoTagState,
          maxVideos
        ).slice(1)
      );

      for (let index = 0; ids.length < maxVideos; index++) {
        let added = false;
        for (const remaining of remainingByCreator) {
          if (ids.length >= maxVideos) break;
          if (remaining[index]) {
            ids.push(remaining[index]);
            added = true;
          }
        }
        if (!added) break;
      }
    }

    return ids;
  }, [creatorsList, props.state.creatorStates, props.state.videoTagState, filters, maxVideos]);

  console.log("REBUILDING HOMEPAGE");

  function renderVideosByCreator() {
    return (
      <section className="video-grid">
        {creatorsList.slice(0, loadAmount).map((creator) => {
          return (
            <CreatorRow
              key={creator.ucid}
              state={props.state}
              dispatch={props.dispatch} 
              creator={creator}
            />
          );
        })}
      </section>
    );
  }

  // TODO(Sam): Is there a way to cut down on the load time?
  // More economical: presorting? or... recognizing when to STOP?

  // Like, retrieve creators on a random/ranked basis and build a list
  // until we don't need to keep going, and then redo if the user reloads/changes filters?
 
  // TODO(Sam): We should only need to do this once, when filters are updated, correct?
  function renderVideoGrid() {

    const hasPlaylistFilter = filters.inWatchLater || filters.inLove;
    const videoIds = hasPlaylistFilter ? videoIdsFromPlaylist : videoIdsFromAllCreators;
    console.log(hasPlaylistFilter ? "Rendering videos from playlist" : "Rendering videos from all creators");

    return (
            <VideoGrid
              key={'video-grid'}
              state={props.state}
              dispatch={props.dispatch} 
              videoIds={videoIds} 
              displayCreator={true}
              maxColumns={maxColumns}
              maxRows={maxRows}
            />
        )
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollPosition = window.scrollY + window.innerHeight;

      const nearBottom = scrollPosition >= scrollHeight * loadThreshold;
      const alreadyLoadedForThisHeight = scrollHeight === lastLoadHeight.current;

      if (nearBottom && !alreadyLoadedForThisHeight) {
        lastLoadHeight.current = scrollHeight;

        setLoadAmount((prev) =>
          Math.min(prev + 10, creatorsList.length)
        );
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  // END SCROLL LOGIC

  if (!creatorsList || creatorsList.length === 0) {
    return <></>;
  }

  return (
    <div className="video-grid-container" 
      // Minwidth calculation to prevent videos from displaying over each other on smaller window sizes.
      style={{ minWidth: `calc(${maxColumns} * (10px + var(--video-card-width)))` }}>
      { renderVideoGrid() }
    </div>
  );
}
