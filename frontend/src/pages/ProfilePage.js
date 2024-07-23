// src/components/Profile.js
import React, { useState, useEffect } from "react";
import axios from "axios";

function ProfilePage({ token, onLogout }) {
  const [userData, setUserData] = useState(null);

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
        onLogout();
      }
    };

    fetchUserProfile();
  }, [token, onLogout]);

  if (!userData) return <p>Loading...</p>;

  return (
    <div>
      <h1>Profile</h1>
      <p><strong>Role:</strong> {userData.role}</p>
      <p><strong>First Name:</strong> {userData.first_name}</p>
      <p><strong>Last Name:</strong> {userData.last_name}</p>
      <p><strong>Email:</strong> {userData.email}</p>
    </div>
  );
}

export default ProfilePage;
