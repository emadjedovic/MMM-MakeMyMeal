import React, { useState, useContext } from "react";
import { Form, Row, Col, Alert, Card, Button } from "react-bootstrap";
import { UserContext } from "../../contexts/UserContext";
import { createAdmin } from "../../api/usersApi";

const CreateRestaurantAdminForm = () => {
  const { token } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const requestData = {
    email: email,
    first_name: firstName,
    last_name: lastName,
    password: password,
  };

  const clear = () => {
    setEmail("");
    setFirstName("");
    setLastName("");
    setPassword("");
  };

  const handleCreateAdmin = async (event) => {
    event.preventDefault();
    try {
      await createAdmin(token, requestData);
      setMessage("User successfully created!");
      clear();
    } catch (error) {
      setMessage("Error in handleCreateAdmin.");
      clear();
    }
  };

  return (
    <Row className="mx-4">
      <Col>
        <h2>Create Restaurant Admin</h2>
        <Card style={{ maxWidth: "400px" }}>
          <Card.Body>
            <Form onSubmit={handleCreateAdmin}>
              <Form.Group controlId="adminEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="form-control-sm"
                  style={{ width: "100%" }}
                />
              </Form.Group>
              <Form.Group controlId="adminFirstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="form-control-sm"
                  style={{ width: "100%" }}
                />
              </Form.Group>
              <Form.Group controlId="adminLastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="form-control-sm"
                  style={{ width: "100%" }}
                />
              </Form.Group>
              <Form.Group controlId="adminPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="form-control-sm"
                  style={{ width: "100%" }}
                />
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
                style={{ margin: "1rem" }}
              >
                Submit
              </Button>
            </Form>
          </Card.Body>
        </Card>

        {message ? (
          <Alert
            variant={message.includes("Error") ? "danger" : "success"}
            className="mt-3"
            style={{ width: "fit-content" }}
          >
            {message}
          </Alert>
        ) : (
          ""
        )}
      </Col>
    </Row>
  );
};

export default CreateRestaurantAdminForm;
