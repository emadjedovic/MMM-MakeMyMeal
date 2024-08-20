import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { createChat } from "./chatApi";
import { fetchUsersByRole } from "../api/usersApi"

const CreateChatModal = ({ show, onHide, token, userId, onChatCreated }) => {
  const [userRole, setUserRole] = useState("ADMIN");
  const [selectedUser, setSelectedUser] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersByRole = await fetchUsersByRole(token, userRole);
        setUsers(usersByRole);
      } catch (error) {
        console.error("Error fetching users by role:", error);
      }
    };

    fetchUsers();
  }, [userRole, token]);

  const handleCreateChat = async () => {
    try {
      await createChat(token, { first_user_id: userId, second_user_id: selectedUser });
      onHide(); // Close the modal
      onChatCreated(); // Notify parent component to refresh the chat list
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Create New Chat</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="userRole">
            <Form.Label>Select User Role</Form.Label>
            <Form.Control as="select" value={userRole} onChange={(e) => setUserRole(e.target.value)}>
              <option value="ADMIN">ADMIN</option>
              <option value="RESTAURANT ADMIN">RESTAURANT ADMIN</option>
              <option value="DELIVERY PERSONNEL">DELIVERY PERSONNEL</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="selectedUser">
            <Form.Label>Select User</Form.Label>
            <Form.Control as="select" value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
              {users.map((user) => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleCreateChat}>
          Create Chat
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateChatModal;
