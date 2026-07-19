import { NavLink } from "react-router-dom";
import './NavBar.css';

export function NavBar() {
  return (
    <div className="nav-bar">
      <h1>Haystack</h1>

      <div className="buttons-bar">
        <input placeholder="Search..." />

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