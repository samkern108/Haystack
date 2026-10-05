import type { Action, State } from "../state/state";
import { CreatorRow } from "../features/creators/CreatorRow";
import { TestButton } from "../features/ui/TestButton";
import { AllCreators } from "../state/types";

interface CreatorsPageProps {
  state: State;
  dispatch: React.ActionDispatch<[action: Action]>;
}

export function CreatorsPage(props: CreatorsPageProps) {
  return (
    <div style={{marginTop: 24}}>
      
      {Object.values(AllCreators).map((creator) => (
        <CreatorRow
          key={creator.ucid}
          creator={creator}
          state={props.state}
          dispatch={props.dispatch}
        />
      ))}

      <TestButton />
    </div>
  );
}