import type { Action, State } from "../state/state";
import { TestButton } from "../features/ui/TestButton";
import { VideoGrid } from "../features/videos/VideoGrid";
import { AllCreators } from "../state/types";

interface HomePageProps {
  state: State;
  dispatch: React.ActionDispatch<[action: Action]>;
}

function getVideoIdsForHomePage(state: State): [string,string][] {
  // Get the video IDs for the home page based on the state.
  // This is a placeholder implementation.
  return Object.keys(AllCreators["UC-3jIAlnQmbbVMV6gR7K8aQ"]?.videos || {}).map((videoId) => ["UC-3jIAlnQmbbVMV6gR7K8aQ", videoId]);
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