import React, { useState, useContext } from "react";
import {
  Form,
  Button,
  Alert,
  Card,
  Row,
  Col,
} from "react-bootstrap";
import { UserContext } from "../../UserContext.js";
import { createDeliveryPersonnel } from "../../api/usersApi.js";

const CreatePersonnelForm = () => {
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

  const handleCreatePersonnel = async (event) => {
    event.preventDefault();
    try {
      await createDeliveryPersonnel(requestData, token);
      setMessage("User successfully created!");
      clear();
    } catch (error) {
      console.error("Error creating the personnel!", error);
    }
  };

  return (
    <Row>
      <Col>
        <h2>Create Delivery Personnel</h2>

        <br></br>
        {message ? (
          <Alert variant={message.includes("Error") ? "danger" : "success"}>
            {message}
          </Alert>
        ) : (
          ""
        )}
      </Col>
      <Col>
        <Card>
          <Card.Body>
            <Form onSubmit={handleCreatePersonnel}>
              <Form.Group controlId="personnelEmail">
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
              <Form.Group controlId="personnelFirstName">
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
              <Form.Group controlId="personnelLastName">
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
              <Form.Group controlId="personnelPassword">
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
      </Col>

      <Col></Col>
    </Row>
  );
};

export default CreatePersonnelForm;
