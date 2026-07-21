import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import './NavBar.css';

export function NavBar() {

  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  function handleSearch(event: React.FormEvent) {
    event.preventDefault();

    if (!query.trim()) return;

    navigate(`/search?q=${encodeURIComponent(query)}`);
  }

  return (
    <div className="nav-bar">
      <h1>Haystack</h1>

      <div className="buttons-bar">
        <form onSubmit={handleSearch}>
          <input
            type="search"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>

        <NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>
          Home
        </NavLink>

        <NavLink to="/playlists" className={({ isActive }) => isActive ? "active" : ""}>
          Playlists
        </NavLink>

        <NavLink to="/about" className={({ isActive }) => isActive ? "active" : ""}>
          About Us
        </NavLink>

        <NavLink to="/submitacreator" className={({ isActive }) => isActive ? "active" : ""}>
          Add A Creator
        </NavLink>
      </div>
    </div>
  );
}