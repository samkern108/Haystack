import type { Action, State } from "../../state/creatorVideoState";
import { creators } from "../../mockData";
import { CreatorRow } from "../creator_components/CreatorRow";
import { TestButton } from "../TestButton";

interface VideoGridProps {
  state: State;
  dispatch: React.ActionDispatch<[action: Action]>;
}


export function VideoGrid(props: VideoGridProps) {
  return (
    <>
      <TestButton />
      {creators.map((creator) => (
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
