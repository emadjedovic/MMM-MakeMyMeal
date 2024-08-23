import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { OverlayTrigger, Tooltip, Badge } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ThemedButton from "./ThemedButton";
import {
  faUser,
  faBell,
  faCommentDots,
} from "@fortawesome/free-solid-svg-icons";
import {
  faMedium,
  faGithub,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";
import icon from "../assets/icon.png";
import { UserContext } from "../contexts/UserContext";
import { NotificationsContext } from "../contexts/NotificationsContext";
import { ThemeContext } from "../contexts/ThemeContext";
import Header from "./Header";

function Sidebar() {
  const { handleLogout, userRole } = useContext(UserContext);
  const navigate = useNavigate();
  const { newNotification } = useContext(NotificationsContext);
  const { theme } = useContext(ThemeContext);

  const handleLogoutButton = () => {
    handleLogout();
    navigate("/login");
  };

  useEffect(() => {
    console.log("New Notification Status:", newNotification);
  }, [newNotification]);

  return (
    <>
      <Header />
      <div className={`sidebar ${theme}`}>
        <OverlayTrigger
          placement="right"
          overlay={<Tooltip id="tooltip-home">Home</Tooltip>}
        >
          <Link to="/" className={`sidebar-item ${theme}`}>
            <img src={icon} alt="MMM" />
          </Link>
        </OverlayTrigger>

        <OverlayTrigger
          placement="right"
          overlay={<Tooltip id="tooltip-profile">Profile</Tooltip>}
        >
          <Link to="/profile" className={`sidebar-item ${theme}`}>
            <FontAwesomeIcon icon={faUser} />
          </Link>
        </OverlayTrigger>

        {userRole === "RESTAURANT ADMIN" && (
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id="tooltip-notifications">Notifications</Tooltip>
            }
          >
            <Link to="/notifications" className={`sidebar-item ${theme}`}>
              <FontAwesomeIcon icon={faBell} />
              {newNotification && (
                <Badge pill bg="danger" className="ms-2">
                  <small>NEW</small>
                </Badge>
              )}
            </Link>
          </OverlayTrigger>
        )}

        <OverlayTrigger
          placement="right"
          overlay={<Tooltip id="tooltip-chat">Chat</Tooltip>}
        >
          <Link to="/chats" className={`sidebar-item ${theme}`}>
            <FontAwesomeIcon icon={faCommentDots} />
          </Link>
        </OverlayTrigger>

        <div className={`sidebar-footer ${theme}`}>
          <ThemedButton
            variant="outline-dark"
            className="m-4"
            onClick={handleLogoutButton}
          >
            Logout
          </ThemedButton>

          <div className={`social-links ${theme}`}>
            <a
              href="https://github.com/emadjedovic"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faGithub} />
            </a>
            <a
              href="https://www.linkedin.com/in/ema-djedovic/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faLinkedinIn} />
            </a>
            <a
              href="https://medium.com/@emadjedovic"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faMedium} />
            </a>
          </div>
          <div className={`footer-text ${theme}`}>
            &copy; 2024 MMM. <br></br>
            All rights reserved.<br></br>
            by Ema Djedović
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
