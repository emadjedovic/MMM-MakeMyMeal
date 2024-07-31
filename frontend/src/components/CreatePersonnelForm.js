// src/components/CreatePersonnelForm.js
import React, { useState, useContext } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import { UserContext } from "../UserContext";

const CreatePersonnelForm = ({ onPersonnelCreated }) => {
  const { token } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");

  const requestData = {
    email: email,
    first_name: firstName,
    last_name: lastName,
    password: password,
  };

  const handleCreatePersonnel = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/users/create/delivery-personnel",
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Delivery personnel created:", response.data);
      setEmail("");
      setFirstName("");
      setLastName("");
      setPassword("");
      onPersonnelCreated(response.data);
    } catch (error) {
      console.error("There was an error creating the personnel!", error);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto" }}>
      <h2>Create Delivery Personnel</h2>
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
        <Button variant="primary" type="submit" style={{ margin: "1rem" }}>
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default CreatePersonnelForm;
