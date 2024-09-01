import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import {
  Alert,
  Button,
  ListGroup,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import axios from "axios";

function ProfilePage() {
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
        console.error("Failed to fetch user profile");
        handleLogout();
        navigate("/login");
      }
    };

    fetchUserProfile();
  }, [token, handleLogout, navigate]);

  if (!userData) return <p>Loading...</p>;

  const handleDeleteButton = async (e) => {
    e.preventDefault();
    try {
      await axios.delete("http://localhost:8000/api/users/me/delete", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      handleLogout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to delete account");
      setErrorMessage("Failed to delete account.");
    }
  };

  return (
    <Container className="my-2">
      <Row className="justify-content-center">
        <Col>
          <h1 className="text-center">PROFILE</h1>
          <ListGroup
            style={{ width: "100%", maxWidth: "600px" }}
            className="shadow-md text-center mx-auto"
          >
            <ListGroup.Item>
              <h3 className="mb-2 p-2">
                <strong>
                  {userData.first_name} {userData.last_name}
                </strong>
              </h3>
            </ListGroup.Item>
            <ListGroup.Item className="p-3">{userData.role}</ListGroup.Item>
            <ListGroup.Item className="p-3">{userData.email}</ListGroup.Item>
            {userData.latitude !== null && (
              <ListGroup.Item className="p-3">
                <strong>Location:</strong> ({userData.latitude.toFixed(5)},{" "}
                {userData.longitude.toFixed(5)})
              </ListGroup.Item>
            )}
          </ListGroup>
          <div className="text-center m-4">
            <Button variant="danger" onClick={handleDeleteButton}>
              Delete Account
            </Button>
          </div>
          {errorMessage && (
            <Alert variant="danger" className="mt-3">
              {errorMessage}
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default ProfilePage;
