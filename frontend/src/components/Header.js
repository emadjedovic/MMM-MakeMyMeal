// src/components/Header.js
import React from "react";
import { Link } from "react-router-dom";
import "../css/Header.css"

function Header({onLogout}) {

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <header>
      <h1>MMM - Make My Meal</h1>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/profile">Profile</Link>
        {/* Other links */}
      </nav>
      <button onClick={handleLogout}>Logout</button>
    </header>
  );
}

export default Header;

