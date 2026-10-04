import type { Action, State } from "../state/state";
import { TestButton } from "../features/ui/TestButton";
import { AllCreators } from "../state/types";
import { CreatorRow } from "../features/creators/CreatorRow";

interface HomePageProps {
  state: State;
  dispatch: React.ActionDispatch<[action: Action]>;
}

export function HomePage(props: HomePageProps) {
  return (
    <div style={{marginTop: 24}}>

      <section className="video-grid">
        {Object.keys(AllCreators).map((creatorId, index) => {
          return (
            <CreatorRow
              key={index}
              state={props.state}
              dispatch={props.dispatch} 
              creator={AllCreators[creatorId]}
            />
          );
        })}
      </section>

      <TestButton />
    </div>
  );
}