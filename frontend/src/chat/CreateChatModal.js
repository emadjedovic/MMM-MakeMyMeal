import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { createChat } from "./chatApi";
import { fetchUsers } from "../api/usersApi"

const CreateChatModal = ({ show, onHide, token, userId, userRole, onChatCreated, existingChatUsers }) => {
  const [selectedUser, setSelectedUser] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const handleFetchUsers = async () => {
      try {
        const allUsers = await fetchUsers(token);
        console.log("existingChatUsers: ", existingChatUsers)
        let availableUsers = allUsers.filter(user => !existingChatUsers.includes(user.id));

        // Filter users based on the current user's role
        switch (userRole) {
          case "RESTAURANT ADMIN":
            availableUsers = availableUsers.filter(user => 
              ["ADMIN", "DELIVERY PERSONNEL", "CUSTOMER"].includes(user.role)
            );
            break;
          case "ADMIN":
            availableUsers = availableUsers.filter(user => 
              ["RESTAURANT ADMIN", "DELIVERY PERSONNEL"].includes(user.role)
            );
            break;
          case "DELIVERY PERSONNEL":
            availableUsers = availableUsers.filter(user => 
              ["ADMIN", "RESTAURANT ADMIN", "CUSTOMER"].includes(user.role)
            );
            break;
          case "CUSTOMER":
            availableUsers = availableUsers.filter(user => 
              ["RESTAURANT ADMIN", "DELIVERY PERSONNEL"].includes(user.role)
            );
            break;
          default:
            availableUsers = []; // No users available if the role doesn't match any case
        }

        setUsers(availableUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    handleFetchUsers();
  }, [token, existingChatUsers, userRole]);

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
          <Form.Group controlId="selectedUser">
            <Form.Label>Select User</Form.Label>
            <Form.Control as="select" value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
              {users.map((user) => (
                <option key={user.id} value={user.id}>{user.first_name} {user.last_name} ({user.role})</option>
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
