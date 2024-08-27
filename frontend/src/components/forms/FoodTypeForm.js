import React, { useState } from "react";
import { Form, Card, Alert, Button } from "react-bootstrap";

const FoodTypeForm = ({ action, onSubmit, foodTypes }) => {
  const [oldName, setOldName] = useState("");
  const [newName, setNewName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (action === "rename") {
        await onSubmit(oldName, newName);
        setMessage("Food type renamed successfully!");
      } else if (action === "delete") {
        await onSubmit(oldName);
        setMessage("Food type deleted successfully!");
      } else {
        await onSubmit(newName);
        clear();
        setMessage("Food type added successfully!");
      }
    } catch (error) {
      setMessage("Error adding the food type.");
    }
  };

  const clear = () => {
    setOldName("");
    setNewName("");
    setMessage("");
  };

  return (
    <Card className="my-3 mx-auto" style={{ maxWidth: "400px" }}>
      <Card.Body>
        <Card.Title>
          {action === "add" ? "Add" : action === "rename" ? "Rename" : "Delete"}{" "}
          Food Type
        </Card.Title>

        <Form onSubmit={handleSubmit}>
          {action === "rename" && (
            <>
              <Form.Group controlId="formOldName" style={{ marginTop: "1rem" }}>
                <Form.Control
                  as="select"
                  value={oldName}
                  onChange={(e) => setOldName(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select Type
                  </option>
                  {foodTypes.map((type) => (
                    <option key={type.id} value={type.name}>
                      {type.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="formNewName" style={{ marginTop: "1rem" }}>
                <Form.Control
                  type="text"
                  placeholder="Enter new type name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                />
              </Form.Group>
            </>
          )}

          {action === "delete" && (
            <Form.Group controlId="formOldName" style={{ marginTop: "1rem" }}>
              <Form.Control
                as="select"
                value={oldName}
                onChange={(e) => setOldName(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select Type
                </option>
                {foodTypes.map((type) => (
                  <option key={type.id} value={type.name}>
                    {type.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          )}
          {action === "add" && (
            <Form.Group controlId="formNewName" style={{ marginTop: "1rem" }}>
              <Form.Control
                type="text"
                placeholder="Enter new type name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
              />
            </Form.Group>
          )}
          <Button variant="primary" type="submit" className="my-3">
            {action === "add"
              ? "Add"
              : action === "rename"
              ? "Rename"
              : "Delete"}
          </Button>
        </Form>

        {message && (
          <Alert
            variant={message.includes("Error") ? "danger" : "success"}
            className="mt-3"
          >
            {message}
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
};

export default FoodTypeForm;
