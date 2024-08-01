// src/pages/Login.js
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Login.css'; // Import custom CSS for background styling
import { UserContext } from '../UserContext'; // Import UserContext
import { loginUser } from "../services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { handleLogin } = useContext(UserContext); // Use UserContext to get handleLogin
  const navigate = useNavigate();

  const requestData = {
    email: email,
    password: password
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(requestData);
      handleLogin(response.access_token);
      console.log("Successful login.");
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Incorrect email or password.");
    }
  };

  const handleRegisterRedirect = () => {
    navigate("/register");
  };

  return (
    <div className="background-wrapper">
      <Container fluid className="p-0 h-100">
        <Row className="h-100 m-0">
          <Col xs={8} className="d-flex flex-column justify-content-center align-items-center text-white overlay-left-side left-side">
            <img src="icon.ico" alt="App Logo" width="150" className="mb-3"/>
            <h1>MMM</h1>
            <h1>Make My Meal</h1>
          </Col>
          <Col xs={4} className="d-flex flex-column justify-content-center align-items-center text-white overlay-right-side">
            <h1 className="mb-5">WELCOME</h1>
            <Form onSubmit={handleLoginSubmit} className="w-75">
              <Form.Group controlId="formEmail" className="mb-3">
                <Form.Control
                  type="email"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formPassword" className="mb-3">
                <Form.Control
                  type="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>
              <Button variant="danger" type="submit" className="w-50 mb-3">
                Login
              </Button>
              {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
              <p>Don't have an account?</p>
              <Button variant="link" onClick={handleRegisterRedirect} className="text-white">
                Register
              </Button>
              <div className="footer-links mt-4">
                <div>
                  <a href="https://github.com/emadjedovic" target="_blank" rel="noopener noreferrer" className="footer-link">GitHub</a>
                  <a href="https://www.linkedin.com/in/ema-djedovic/" target="_blank" rel="noopener noreferrer" className="footer-link">LinkedIn</a>
                  <a href="https://medium.com/@emadjedovic" target="_blank" rel="noopener noreferrer" className="footer-link">Medium</a>
                </div>
                <div className="mt-4">
                &copy; 2024 MMM. All rights reserved. <br></br>
                by Ema Djedović
                </div>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
