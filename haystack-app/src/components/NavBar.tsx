import { useNavigate } from "react-router-dom";

export function NavBar() {
  const navigate = useNavigate();

  return (
    <div className="nav-bar">
      <h1>Haystack</h1>
      <div className="buttons-bar">
        <button onClick={() => navigate('/')}> Home </button>
        <button onClick={() => navigate('/about')}> About Us </button>
      </div>
    </div>
    );
};