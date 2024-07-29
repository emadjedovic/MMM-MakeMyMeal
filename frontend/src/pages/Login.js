import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Login.css'; // Import custom CSS for background styling

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/auth/login", {
        email: email,
        password: password,
      });
      localStorage.setItem("access_token", response.data.access_token);
      setToken(response.data.access_token);
      console.log("Successful login.");
      navigate("/home");
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
            <Form onSubmit={handleLogin} className="w-75">
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
                &copy; 2024 MMM. All rights reserved. <br></br>Ema Djedović
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
