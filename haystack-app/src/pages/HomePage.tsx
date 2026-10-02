import type { Action, State } from "../state/state";
import { TestButton } from "../features/ui/TestButton";
import { VideoGrid } from "../features/videos/VideoGrid";

interface HomePageProps {
  state: State;
  dispatch: React.ActionDispatch<[action: Action]>;
}

function getVideoIdsForHomePage(state: State): string[] {
  // Get the video IDs for the home page based on the state.
  // This is a placeholder implementation. You can modify it to fetch video IDs based on your application's logic.
  return Object.keys(state.videos || {});
}

export function HomePage(props: HomePageProps) {
  return (
    <div style={{marginTop: 24}}>
      
      <VideoGrid
        videoIds={getVideoIdsForHomePage(props.state)}
        state={props.state}
        dispatch={props.dispatch}
      />

      <TestButton />
    </div>
  );
}