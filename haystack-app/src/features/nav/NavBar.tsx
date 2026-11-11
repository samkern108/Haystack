import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { VideoFilterMenu } from "../filtering/VideoFilterMenu";
import { type Action, type FilterPreset, type CreatorState, type VideoFilterState, type VideoTagState } from "../../state/state";
import { useTheme } from "../../hooks/useTheme";

import './NavBar.scss';
import { PlaylistMenu } from "../filtering/PlaylistMenu";

interface NavBarProps {
  filterPresets: FilterPreset[];
  activeFilterPresetId?: string;
  videoFilterState: VideoFilterState;
  videoTagState: VideoTagState;
  creatorStates: Record<string, CreatorState>;
  dispatch: React.ActionDispatch<[action: Action]>;
}

export function NavBar(props: NavBarProps) {

  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const { theme, toggleTheme } = useTheme();

  function handleSearch(event: React.FormEvent) {
    event.preventDefault();

    if (!query.trim()) return;

    navigate(`/search?q=${encodeURIComponent(query)}`);
  }

  return (
    <div className="nav-bar">
      <NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>
        <h1>Haystack</h1>
      </NavLink>

      <div className="buttons-bar">
        <form onSubmit={handleSearch}>
          <input
            type="search"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>
        
        <VideoFilterMenu filterPresets={props.filterPresets} activeFilterPresetId={props.activeFilterPresetId} videoFilterState={props.videoFilterState} videoTagState={props.videoTagState} creatorStates={props.creatorStates} dispatch={props.dispatch} />

        <PlaylistMenu videoFilterState={props.videoFilterState} dispatch={props.dispatch} />


        <NavLink to="/tags" className={({ isActive }) => isActive ? "active" : ""}>Tags</NavLink>

        <NavLink to="/about" className={({ isActive }) => isActive ? "active" : ""}>
          About Us
        </NavLink>

        <NavLink to="/submitacreator" className={({ isActive }) => isActive ? "active" : ""}>
          Add A Creator
        </NavLink>

        <div className="app">
          <button onClick={toggleTheme}>
            {theme === "light" ? "Light" : "Dark"}
          </button>
        </div>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `profile ${isActive ? "active" : ""}`
          }
          aria-label="Profile"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
          </svg>
        </NavLink>
      </div>
    </div>
  );
}
