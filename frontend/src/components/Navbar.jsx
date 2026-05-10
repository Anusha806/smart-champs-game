import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <h2 className="logo">SMART CHAMPS</h2>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/leaderboard">Leaderboard</Link>
        <Link to="/register">Play Now</Link>
      </div>
    </nav>
  );
}

export default Navbar;