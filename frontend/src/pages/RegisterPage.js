import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import RegisterMap from "../components/RegisterMap";
import { Container, Row, Col, Form, Alert, Button } from "react-bootstrap";
import "../css/RegisterPage.css";
import { UserContext } from "../contexts/UserContext";
import { registerUser } from "../api/authApi";

const RegisterPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { handleLogin } = useContext(UserContext);
  const navigate = useNavigate();

  const requestData = {
    first_name: firstName,
    last_name: lastName,
    email: email,
    password: password,
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
  };

  const clear = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setFirstName("");
    setPassword("");
    setLatitude("");
    setLongitude("");
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await registerUser(requestData);
      handleLogin(response.access_token);
      console.log("Successful registration.");
    } catch (error) {
      console.error("Registration error:");
      setErrorMessage("Registration failed. Please try again.");
      clear();
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  const handleLocationSelect = (latlng) => {
    setLatitude(latlng.lat);
    setLongitude(latlng.lng);
  };

  return (
    <div className="background-wrapper" data-bs-theme="light">
      <Container fluid className="p-0 h-100">
        <Row className="h-100 m-0">
          <Col
            xs={8}
            className="d-flex flex-column justify-content-center align-items-center text-white overlay-left-side"
          >
            <div className="map-container">
              <RegisterMap onLocationSelect={handleLocationSelect} />
            </div>
            <div className="footer-links mt-5">
              <div>
                <a
                  href="https://github.com/emadjedovic"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/ema-djedovic/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  LinkedIn
                </a>
                <a
                  href="https://medium.com/@emadjedovic"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  Medium
                </a>
                &copy; 2024 MMM. All rights reserved. by Ema Djedović
              </div>
            </div>
          </Col>
          <Col
            xs={4}
            className="d-flex flex-column justify-content-center align-items-center text-white overlay-right-side"
          >
            <h1 className="mb-4 mt-0">REGISTER</h1>
            <Form onSubmit={handleRegisterSubmit} className="w-75">
              <Form.Group controlId="formFirstName" className="mb-2">
                <Form.Control
                  type="text"
                  placeholder="Enter First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formLastName" className="mb-2">
                <Form.Control
                  type="text"
                  placeholder="Enter Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formEmail" className="mb-2">
                <Form.Control
                  type="email"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formPassword" className="mb-2">
                <Form.Control
                  type="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formLatitude" className="mb-2">
                <Form.Control
                  type="text"
                  placeholder="Enter Latitude"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formLongitude" className="mb-2">
                <Form.Control
                  type="text"
                  placeholder="Enter Longitude"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                />
              </Form.Group>
              <Button variant="danger" type="submit" className="w-50 m-3">
                Register
              </Button>
              {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
              <p className="mb-0">
                Already have an account?
                <Button
                  variant="link"
                  onClick={handleLoginRedirect}
                  className="text-white pt-0 pb-2"
                >
                  Login
                </Button>
              </p>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default RegisterPage;
