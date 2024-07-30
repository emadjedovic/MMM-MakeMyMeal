// src/components/CreateRestaurantAdminForm.js
import React, { useState, useContext } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import { UserContext } from "../UserContext";

const CreateRestaurantAdminForm = ({ onAdminCreated }) => {
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

  const handleCreateAdmin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/users/create/restaurant-admin",
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Restaurant admin created:", response.data);
      setEmail("");
      setFirstName("");
      setLastName("");
      setPassword("");
      onAdminCreated(response.data);
    } catch (error) {
      console.error("There was an error creating the restaurant admin!", error);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto" }}>
      <h2>Create Restaurant Admin</h2>
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
        <Button variant="primary" type="submit" style={{ margin: "1rem" }}>
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default CreateRestaurantAdminForm;
