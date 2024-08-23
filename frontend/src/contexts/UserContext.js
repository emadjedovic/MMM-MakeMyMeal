import React, { createContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("access_token"));
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem("access_token", newToken);
    navigate("/");
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    setUserRole(null);
    localStorage.removeItem("access_token");
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log("Calling axios to fetch user.");
        const response = await axios.get("http://localhost:8000/api/users/me", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
        setUserRole(response.data.role);
        console.log("User set.");
        if (location.pathname === "/login") {
          navigate("/home");
        }
      } catch (error) {
        console.error(
          "Error fetching user data from UserContext.js (or user logged out)."
        );
        handleLogout();
      }
    };

    fetchUser();
  }, [token, location.pathname, navigate]);

  return (
    <UserContext.Provider
      value={{ token, user, userRole, handleLogin, handleLogout }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };
