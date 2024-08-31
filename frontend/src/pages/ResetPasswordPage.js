import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Row, Col, Form, Button, Container, Alert } from "react-bootstrap";
import axios from "axios";
import "../css/ResetPasswordPage.css";

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(null);
  const [token, setToken] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setEmail(searchParams.get("email"));
    setToken(searchParams.get("token"));
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      console.log("Sending via axios: ", { email, newPassword, token });
      const response = await axios.post(
        "http://localhost:8000/api/auth/reset-password",
        {
          email,
          new_password: newPassword,
          token,
        }
      );
      if (response.data.message === "Password has been updated") {
        setSuccess("Password has been updated successfully!");
        setError("");
      }
    } catch (error) {
      console.log("Axios in ResetPasswordPage failed.");
      setError("Failed to reset password. Please try again.");
      setSuccess("");
    }
  };

  const handleNavigateToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="background-wrapper" data-bs-theme="light">
      <Container fluid className="p-0 h-100">
        <Row className="h-100 m-0">
          <Col className="d-flex flex-column justify-content-center align-items-center reset-password-container">
            <Form onSubmit={handleSubmit} style={{}}>
              <h2>RESET PASSWORD</h2>

              <Form.Group
                controlId="formNewPassword"
                style={{ marginBottom: "1rem" }}
              >
                <Form.Control
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </Form.Group>

              <Form.Group
                controlId="formConfirmPassword"
                style={{ marginBottom: "1rem" }}
              >
                <Form.Control
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Form.Group>

              {error && <p className="error text-danger">{error}</p>}
              {success && (
                <div className="text-center">
                  <Alert variant="success">{success}</Alert>
                  <Button
                    variant="danger"
                    onClick={handleNavigateToLogin}
                    style={{ marginTop: "1rem" }}
                  >
                    Go to Login
                  </Button>
                </div>
              )}

              {!success && (
                <Button
                  variant="danger"
                  type="submit"
                  style={{ margin: "1rem" }}
                >
                  CONFIRM
                </Button>
              )}
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ResetPasswordPage;
