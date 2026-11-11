import { CreatorActions } from "./CreatorActions";
import type { Action, CreatorState } from "../../state/state";
import { useDelayedHover } from "../../utils/hoverlogic";
import type { Creator } from "../../state/types";
import { getChannelURL } from "../../utils/creatorhelpers";
import "./CreatorRow.css"
import "../ui/styles/LinedPaper.scss"

// TODO(sam): Add a little heart / star / x to the side of a creator's name!

interface CreatorInfoProps {
  creator: Creator;
  creatorState: CreatorState;
  dispatch: React.ActionDispatch<[action: Action]>;
}

export function CreatorInfo(props: CreatorInfoProps) {
  const hover = useDelayedHover(50);

  console.log('loading creator ' + props.creator.ucid);

  return (
    <div
      className="creator-info"
      onPointerEnter={hover.onPointerEnter}
      onPointerLeave={hover.onPointerLeave}
    >
      <img className="creator-avatar" 
        src={props.creator.avatar.url} 
        alt={props.creator.name} 
        loading="lazy" />

      <h2>{props.creator.name}</h2>

      {hover.hovered && (
        <div className="creator-popover">
          <a
            href={getChannelURL(props.creator.ucid)}
            target="_blank"
            rel="noreferrer"
          >
            <img
              className="creator-avatar"
              src={props.creator.avatar.url}
              alt={props.creator.name}
              loading="lazy"
            />
            <h2>{props.creator.name}</h2>
          </a>

          <CreatorActions
            creatorId={props.creator.ucid}
            creatorState={props.creatorState}
            dispatch={props.dispatch}
          />
        </div>
      )}
    </div>
  );
}
