import type { Action, State } from "../state/state";
import { TestButton } from "../features/ui/TestButton";
import { VideoGrid } from "../features/videos/VideoGrid";

interface HomePageProps {
  state: State;
  dispatch: React.ActionDispatch<[action: Action]>;
}

export function HomePage(props: HomePageProps) {
  return (
    <div style={{marginTop: 24}}>
      
      <VideoGrid
        videoIds={[]}
        state={props.state}
        dispatch={props.dispatch}
      />

      <TestButton />
    </div>
  );
}