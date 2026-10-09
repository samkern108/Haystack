import { getCreatorState, getVideoFilterState, type Action, type AppState } from "../state/state";
import { TestButton } from "../features/ui/TestButton";
import { AllCreators, type Creator } from "../state/types";
import { CreatorRow } from "../features/creators/CreatorRow";
import { useEffect, useMemo, useRef, useState } from "react";
import { filterVideosForCreator } from "../utils/videohelpers";
import { VideoGrid } from "../features/videos/VideoGrid";
import { shuffleCreators } from "../utils/creatorhelpers";

interface HomePageProps {
  state: AppState;
  dispatch: React.ActionDispatch<[action: Action]>;
}

export function HomePage(props: HomePageProps) {

  // SCROLL LOGIC
  // Load more creators when the user scrolls near the end of the page.
  const loadThreshold = 0.9;
  const [loadAmount, setLoadAmount] = useState(10);
  const lastLoadHeight = useRef(0);

  const filters = getVideoFilterState(props.state);

  // Remove creators based on the user's defined filters.
  // Also, pre-shuffle the creators so we don't always show them in the same order.
  const creatorsList: Creator[] = useMemo(
    () => shuffleCreators(Object.values(AllCreators)).filter(creator => {
      const creatorState = props.state.creatorStates[creator.ucid];
      if (props.state.videoFilterStates.creator === "unfollowed") return !creatorState.followed;
      if (props.state.videoFilterStates.creator === "followed") return creatorState.followed;

      return true;
  }), []); // TODO(sam): Are there any instances on which this should recompute?

  const videoIds = useMemo(() => {
    let ids = [] as [creatorId: string, videoId: string][];

    creatorsList.forEach((creator) => {
      ids = ids.concat(
        filterVideosForCreator(
          creator.ucid,
          getCreatorState(props.state, creator.ucid),
          filters,
          creator.videos,
          1
        )
      );
    });

    return ids;
  }, [creatorsList, props.state.creatorStates, filters ]);

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
    return (
            <VideoGrid
              key={'video-grid'}
              state={props.state}
              dispatch={props.dispatch} 
              videoIds={videoIds} 
              displayCreator={true}
              maxColumns={4}
              maxRows={4}
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
    <div style={{marginTop: 24}}>
      { renderVideoGrid() }
    </div>
  );
}