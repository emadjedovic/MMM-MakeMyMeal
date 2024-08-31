import React, { useState, useContext } from "react";
import { Form, Alert, Card, Row, Col, Button } from "react-bootstrap";
import { UserContext } from "../../contexts/UserContext.js";
import { createDeliveryPersonnel } from "../../api/usersApi.js";
import { cities } from "../../cities.js";

const CreatePersonnelForm = () => {
  const { token } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [selectedCity, setSelectedCity] = useState(cities[0].name);

  const handleCreatePersonnel = async (event) => {
    event.preventDefault();

    const cityData = cities.find((city) => city.name === selectedCity);

    const requestData = {
      email: email,
      first_name: firstName,
      last_name: lastName,
      password: password,
      latitude: cityData.latitude,
      longitude: cityData.longitude,
    };

    try {
      await createDeliveryPersonnel(token, requestData);
      setMessage("User successfully created!");
      clear();
    } catch (error) {
      console.error("Error in handleCreatePersonnel.");
    }
  };

  const clear = () => {
    setEmail("");
    setFirstName("");
    setLastName("");
    setPassword("");
  };

  return (
    <Row className="mx-4">
      <Col>
        <h2>Create Delivery Personnel</h2>
        <Card style={{ maxWidth: "400px" }}>
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
              <Form.Group controlId="personnelCity">
                <Form.Label>City</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="form-control-sm"
                  style={{ width: "100%" }}
                >
                  {cities.map((city) => (
                    <option key={city.name} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </Form.Control>
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

export default CreatePersonnelForm;
