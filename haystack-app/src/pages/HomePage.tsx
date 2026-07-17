import type { Action, State } from "../state/creatorVideoState";
import { MockData_AllCreators } from "../storage/mockData";
import { CreatorRow } from "../components/creator/CreatorRow";
import { TestButton } from "../components/ui/TestButton";

interface HomePageProps {
  state: State;
  dispatch: React.ActionDispatch<[action: Action]>;
}

export function HomePage(props: HomePageProps) {
  return (
    <>
      <TestButton />
      
      {MockData_AllCreators.map((creator) => (
        <CreatorRow
          key={creator.creatorId_yt}
          creator={creator}
          state={props.state}
          dispatch={props.dispatch}
        />
      ))}
    </>
  );
}