import type { State, Action } from "../../state/state";
import { useDelayedHover } from "../../utils/hoverlogic";
import "./CreatorRow.css"
import "../ui/styles/LinedPaper.scss"
import type { Creator } from "../../state/types";
import { getChannelURL } from "../../utils/videohelpers";

interface CreatorInfoProps {
  creator: Creator;
  state: State;
  dispatch: React.ActionDispatch<[action: Action]>;
}

export function CreatorInfo(props: CreatorInfoProps) {
  const hover = useDelayedHover(50);

  const creatorState = props.state.creators?.[props.creator.ucid];

  function handleExploreButtonClick() {
    
  }

  function handleCreatorButtonClick(field: "followed" | "favorite" | "doNotShow") {
    props.dispatch({
      type: "TOGGLE_CREATOR_FLAG",
      creatorId: props.creator.ucid,
      field:field
    });
  }

  return (
    <div
      className="creator-info"
      onPointerEnter={hover.onPointerEnter}
      onPointerLeave={hover.onPointerLeave}
    >
      <img className="creator-avatar" src={props.creator.avatar.url} alt={props.creator.name} />
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
            />
            <h2>{props.creator.name}</h2>
          </a>

          <div className="creator-actions">
            
            <button className={`creator-action-button follow ${
                creatorState.followed ? "active" : ""
              }`}
              title="Follow this creator"
              onClick={() => handleCreatorButtonClick("followed")}>
              +
            </button>

            <button className={`creator-action-button favorite ${
                creatorState.favorite ? "active" : ""
              }`}
              title="Favorite this creator"
              onClick={() => handleCreatorButtonClick("favorite")}>
              ⭐️
            </button>
          
            <button className="creator-action-button" 
              title="Explore this creator"
              onClick={handleExploreButtonClick}>
              🔍
            </button>

            <button className={`creator-action-button donotshow ${
                creatorState.doNotShow ? "active" : ""
              }`}
              title="Do not recommend this creator"
              onClick={() => handleCreatorButtonClick("doNotShow")}>
              x
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
