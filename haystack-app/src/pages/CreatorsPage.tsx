import type { Action, State } from "../state/state";
import { MockData_AllCreators } from "../storage/mockData";
import { CreatorRow } from "../features/creators/CreatorRow";
import { TestButton } from "../features/ui/TestButton";

interface CreatorsPageProps {
  state: State;
  dispatch: React.ActionDispatch<[action: Action]>;
}

export function CreatorsPage(props: CreatorsPageProps) {
  return (
    <div style={{marginTop: 24}}>
      
      {Object.values(MockData_AllCreators).map((creator) => (
        <CreatorRow
          key={creator.creatorId_yt}
          creator={creator}
          state={props.state}
          dispatch={props.dispatch}
        />
      ))}

      <TestButton />
    </div>
  );
}