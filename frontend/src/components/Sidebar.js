// src/components/Sidebar.js
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faMedium, faGithub, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import "../css/App.css";
import icon from "../assets/icon.png"; // Ensure the path is correct
import { UserContext } from '../UserContext'; // Import UserContext

function Sidebar() {
  const {handleLogout} = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogoutButton = () => {
    handleLogout()
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <OverlayTrigger
        placement="right"
        overlay={<Tooltip id="tooltip-home">Home</Tooltip>}
      >
        <Link to="/" className="sidebar-item">
          <img src={icon} alt="MMM" />
        </Link>
      </OverlayTrigger>
      <OverlayTrigger
        placement="right"
        overlay={<Tooltip id="tooltip-profile">Profile</Tooltip>}
      >
        <Link to="/profile" className="sidebar-item">
          <FontAwesomeIcon icon={faUser} />
        </Link>
      </OverlayTrigger>


      {/* Footer section within the sidebar */}
      <div className="sidebar-footer">
      <Button variant="outline-dark" className="m-4" onClick={handleLogoutButton}>
        Logout
      </Button>
        <div className="social-links">
          <a href="https://github.com/emadjedovic" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faGithub} />
          </a>
          <a href="https://www.linkedin.com/in/ema-djedovic/" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faLinkedinIn} />
          </a>
          <a href="https://medium.com/@emadjedovic" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faMedium} />
          </a>
        </div>
        <div className="footer-text">
          &copy; 2024 MMM. <br></br>
          All rights reserved.<br></br>
          by Ema Djedović
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
