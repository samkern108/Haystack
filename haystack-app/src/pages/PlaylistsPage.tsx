import { useState } from "react";

import type { Action, State } from "../state/state";
import { PlaylistRow_Favorites } from "../features/playlists/PlaylistRow_Favorites";
import "./styles/Modal.scss";
import "../features/ui/styles/LinedPaper.scss";
import { PlaylistRow } from "../features/playlists/PlaylistRow";

interface PlaylistsPageProps {
  state: State;
  dispatch: React.ActionDispatch<[action: Action]>;
}

export function PlaylistsPage(props: PlaylistsPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [playlistName, setPlaylistName] = useState("");

  function createNewPlaylist() {
    const trimmedName = playlistName.trim();

    if (!trimmedName) return;

    props.dispatch({
      type: "CREATE_NEW_PLAYLIST",
      playlistId: crypto.randomUUID(),
      playlistName: trimmedName,
    });

    setPlaylistName("");
    setIsModalOpen(false);
  }

  function cancelNewPlaylist() {
    setPlaylistName("");
    setIsModalOpen(false);
  }

  return (
    <div>
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal ">
            <h2>Create Playlist</h2>

            <input
              id="playlist-name"
              type="text"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              placeholder="Playlist name"
              autoFocus
            />

            <div className="modal-button-bar">
              <button
                type="button"
                onClick={cancelNewPlaylist}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={createNewPlaylist}
                disabled={!playlistName.trim()}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      <PlaylistRow_Favorites
        key="all_favorites"
        state={props.state}
        dispatch={props.dispatch}
      />

      {Object.values(props.state.playlists).map((playlist) => (
      <PlaylistRow
        key={playlist.id}
        state={props.state}
        playlist={playlist}
        dispatch={props.dispatch}
      />
    ))}

      <button onClick={() => setIsModalOpen(true)}>
        New Playlist
      </button>
    </div>
  );
}