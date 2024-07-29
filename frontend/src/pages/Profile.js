// src/components/Profile.js
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from '../UserContext'; // Import UserContext
import { Alert } from "react-bootstrap";
import axios from "axios";

function Profile() {
  const { token, handleLogout } = useContext(UserContext);
  const [userData, setUserData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/users/me", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);
      } catch (error) {
        console.error("Failed to fetch user profile", error);
        handleLogout();
        navigate('/login');
      }
    };

    fetchUserProfile();
  }, [token, handleLogout]);

  if (!userData) return <p>Loading...</p>;

  const handleDeleteButton = async (e) => {
    e.preventDefault();
    try {
      await axios.delete('http://localhost:8000/api/users/me/delete', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      handleLogout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to delete account', error);
      setErrorMessage("Failed to delete account.");
    }
  };

  return (
    <div>
      <h1>Profile</h1>
      <p><strong>Role:</strong> {userData.role}</p>
      <p><strong>First Name:</strong> {userData.first_name}</p>
      <p><strong>Last Name:</strong> {userData.last_name}</p>
      <p><strong>Email:</strong> {userData.email}</p>
      <button onClick={handleDeleteButton}>Delete Account</button>
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
    </div>
  );
}

export default Profile;
