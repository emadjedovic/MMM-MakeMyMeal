import React, { useState, useEffect } from "react";
import { Modal, Form } from "react-bootstrap";
import { createChat } from "./chatApi";
import { fetchUsers } from "../api/usersApi";
import ThemedButton from "../components/ThemedButton";

const CreateChatModal = ({
  show,
  onHide,
  token,
  userId,
  userRole,
  onChatCreated,
  existingChatUsers,
}) => {
  const [selectedUserId, setSelectedUserId] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const handleFetchUsers = async () => {
      try {
        const allUsers = await fetchUsers(token);
        console.log("existingChatUsers: ", existingChatUsers);
        let availableUsers = allUsers.filter(
          (user) => !existingChatUsers.includes(user.id)
        );

        switch (userRole) {
          case "RESTAURANT ADMIN":
            availableUsers = availableUsers.filter((user) =>
              ["ADMIN", "DELIVERY PERSONNEL", "CUSTOMER"].includes(user.role)
            );
            break;
          case "ADMIN":
            availableUsers = availableUsers.filter((user) =>
              ["RESTAURANT ADMIN", "DELIVERY PERSONNEL"].includes(user.role)
            );
            break;
          case "DELIVERY PERSONNEL":
            availableUsers = availableUsers.filter((user) =>
              ["ADMIN", "RESTAURANT ADMIN", "CUSTOMER"].includes(user.role)
            );
            break;
          case "CUSTOMER":
            availableUsers = availableUsers.filter((user) =>
              ["RESTAURANT ADMIN", "DELIVERY PERSONNEL"].includes(user.role)
            );
            break;
          default:
            availableUsers = [];
        }

        setUsers(availableUsers);
      } catch (error) {
        console.error("Error in handleFetchUsers.");
      }
    };

    handleFetchUsers();
  }, [token, existingChatUsers, userRole]);

  const handleCreateChat = async () => {
    if (!selectedUserId) {
      console.error("No user selected!");
      return;
    }

    try {
      console.log("selectedUserId: ", selectedUserId);

      await createChat(token, {
        first_user_id: userId,
        second_user_id: selectedUserId,
      });
      onHide();
      onChatCreated();
    } catch (error) {
      console.error("Error in handleCreateChat:");
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Create New Chat</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="selectedUserId">
            <Form.Label>Select User</Form.Label>
            <Form.Control
              as="select"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
            >
              <option value="">-- Select a User --</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.first_name} {user.last_name} ({user.role})
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <ThemedButton variant="secondary" onClick={onHide}>
          Cancel
        </ThemedButton>
        <ThemedButton
          variant="primary"
          onClick={handleCreateChat}
          disabled={!selectedUserId}
        >
          Create Chat
        </ThemedButton>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateChatModal;
