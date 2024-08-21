import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { ListGroup, Container, Row, Col, Button } from "react-bootstrap";
import { UserContext } from "../UserContext";
import { fetchChats, fetchUserInfoFromChat } from "./chatApi";
import CreateChatModal from "./CreateChatModal.js";
import "./chat.css"; // Import the CSS file

const AllChats = () => {
  const { token, user } = useContext(UserContext);
  const [chats, setChats] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Fetch list of chats connected to the current user
    const fetchChatsData = async () => {
      try {
        const fetchedChats = await fetchChats(token, user.id); // Wait for the API call to resolve

        // Fetch the user info for each chat and update the chat objects
        const chatsWithInfo = await Promise.all(
          fetchedChats.map(async (chat) => {
            const userInfo = await fetchUserInfoFromChat(token, user.id, chat.id);
            return { 
              ...chat, 
              firstName: userInfo.first_name, 
              lastName: userInfo.last_name, 
              role: userInfo.role,
              userId: userInfo.id // Store the user ID
            }; // Add the firstName, lastName, and userRole to each chat object
          })
        );

        setChats(chatsWithInfo); // Set the resolved data to chats state
      } catch (error) {
        console.error("Error fetching chats or user info:", error);
      }
    };

    fetchChatsData(); // Call the async function
  }, [token, user.id]);

  const handleChatCreated = () => {
    setShowModal(false);
    window.location.reload(); // Reload to show the new chat
  };

  const existingChatUsers = chats.map(chat => chat.userId);

  return (
    <Container>
      <Row>
        <Col>
        <h1>INBOX</h1>
          <Button variant="outline-dark" onClick={() => setShowModal(true)}>Create New Chat</Button>
          <br /><br />
          <ListGroup className="custom-list-group">
            {chats.map((chat) => (
              <Link
              key={chat.id}
              to={`/chats/${chat.id}/${chat.firstName}`}
              className="custom-link"
            >
              <ListGroup.Item
                key={chat.id}
                className="custom-list-group-item"
              >
                {chat.firstName} {chat.lastName} ({chat.role || "Loading..."})
              </ListGroup.Item>
            </Link>
            ))}
          </ListGroup>
        </Col>
      </Row>

      <CreateChatModal
        show={showModal}
        onHide={() => setShowModal(false)}
        token={token}
        userId={user.id}
        userRole={user.role}
        onChatCreated={handleChatCreated}
        existingChatUsers={existingChatUsers} // Pass user IDs already in chats
      />
    </Container>
  );
};

export default AllChats;
