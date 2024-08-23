import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import axios from "axios";

const ForgotPasswordModal = ({ show, onHide }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/auth/forgot-password", {
        email,
      });
      setMessage("Password reset email sent!");
      setError("");
    } catch (err) {
      setError("Failed to send reset email. Please try again.");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header
        closeButton
        style={{ backgroundColor: "#1e1e1e", color: "whitesmoke" }}
      >
        <Modal.Title>Password Reset</Modal.Title>
      </Modal.Header>

      <Modal.Body
        className="p-4"
        style={{
          backgroundColor: "#1e1e1e",
          color: "whitesmoke",
          textAlign: "center",
        }}
      >
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formEmail" className="mb-4">
            <Form.Label className="mb-4">
              To reset your password, please enter the email address you used to
              register:
            </Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="danger" type="submit">
            Submit
          </Button>
        </Form>

        {message && (
          <Alert className="m-4 p-2" variant="success">
            {message}
          </Alert>
        )}
        {error && (
          <Alert className="m-4 p-2" variant="danger">
            {error}
          </Alert>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ForgotPasswordModal;
