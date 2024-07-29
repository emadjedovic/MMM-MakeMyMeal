// src/components/Profile.js
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from '../UserContext';
import { Alert, Button, Container, Card } from "react-bootstrap";
import axios from "axios";
import "../css/App.css"

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
  }, [token, handleLogout, navigate]);

  if (!userData) return <p>Loading...</p>;

  const handleDeleteButton = async (e) => {
    e.preventDefault();
    try {
      await axios.delete('http://localhost:8000/api/users/me/delete', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
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
      <h1>PROFILE</h1>
      <Card>
        <Card.Body>
          <Card.Text>
            <strong>ROLE:</strong> {userData.role}
          </Card.Text>
          <Card.Text>
            <strong>FIRST NAME:</strong> {userData.first_name}
          </Card.Text>
          <Card.Text>
            <strong>LAST NAME:</strong> {userData.last_name}
          </Card.Text>
          <Card.Text>
            <strong>EMAIL:</strong> {userData.email}
          </Card.Text>
          <Button 
            variant="danger" 
            onClick={handleDeleteButton}
            className="mt-3"
          >
            Delete Account
          </Button>
          {errorMessage && <Alert variant="danger" className="mt-3">{errorMessage}</Alert>}
        </Card.Body>
      </Card>
    </div>
  );
}

export default Profile;
