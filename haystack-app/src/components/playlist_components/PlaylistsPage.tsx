import type { Action, State } from "../../state/creatorVideoState";
import { PlaylistRow } from "./PlaylistRow";

interface PlaylistsPageProps {
  state: State;
  dispatch: React.ActionDispatch<[action: Action]>;
}

function createNewPlaylist ( dispatch: React.ActionDispatch<[action: Action]> ) {
    dispatch({
        type: "CREATE_NEW_PLAYLIST",
        playlistId: "id",
        playlistName: "name",
    });
}

export function PlaylistsPage(props: PlaylistsPageProps) {
  return (
    <div>
      <button onClick={() => createNewPlaylist(props.dispatch)}>New Playlist</button>

    {Object.values(props.state.playlists).map((playlist) => (
      <PlaylistRow
        state={props.state}
        playlist={playlist}
        dispatch={props.dispatch}
      />
    ))}
    </div>
  );
}