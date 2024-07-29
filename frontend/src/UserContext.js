// src/UserContext.js
import React, { createContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem('access_token', newToken);
    navigate("/home");
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    setUserRole(null);
    localStorage.removeItem('access_token');
  };
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8000/api/users/me',
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser(response.data);
        setUserRole(response.data.role);
        if (location.pathname === "/login") {
          navigate("/home");
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        handleLogout();
      }
    };
  
    fetchUser();
  }, [token, location.pathname, navigate]);
  

  return (
    <UserContext.Provider value={{ token, user, userRole, handleLogin, handleLogout }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };
