import { useNavigate } from "react-router-dom";
import type { Action, CreatorState } from "../../state/state";
import { AppRoutes } from "../nav/routes";
import "./CreatorRow.css";

interface CreatorActionsProps {
  creatorId: string;
  creatorState: CreatorState;
  dispatch: React.ActionDispatch<[action: Action]>;
}

export function CreatorActions(props: CreatorActionsProps) {
  const navigate = useNavigate();
  function handleCreatorButtonClick(field: "followed" | "favorite" | "doNotShow") {
    props.dispatch({ type: "TOGGLE_CREATOR_FLAG", creatorId: props.creatorId, field });
  }
  return (
          <div className="creator-actions">
            
            <button className={`creator-action-button follow ${
                props.creatorState.followed ? "active" : ""
              }`}
              aria-pressed={props.creatorState.followed ?? false}
              title={props.creatorState.followed ? "Unfollow this creator" : "Follow this creator"}
              onClick={() => handleCreatorButtonClick("followed")}>
              +
            </button>

            <button className={`creator-action-button favorite ${
                props.creatorState.favorite ? "active" : ""
              }`}
              aria-pressed={props.creatorState.favorite ?? false}
              title={props.creatorState.favorite ? "Unfavorite this creator" : "Favorite this creator"}
              onClick={() => handleCreatorButtonClick("favorite")}>
              ⭐️
            </button>
          
            <button className="creator-action-button" 
              title="Explore this creator"
              onClick={() => navigate(AppRoutes.creator(props.creatorId))}>
              🔍
            </button>

            <button className={`creator-action-button donotshow ${
                props.creatorState.doNotShow ? "active" : ""
              }`}
              aria-pressed={props.creatorState.doNotShow ?? false}
              title={props.creatorState.doNotShow ? "Allow recommendations from this creator" : "Do not recommend this creator"}
              onClick={() => handleCreatorButtonClick("doNotShow")}>
              x
            </button>
          </div>
  );
}
