import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { ListGroup, Container, Row, Col, Button } from "react-bootstrap";
import { UserContext } from "../UserContext";
import { fetchChats, fetchNameFromChat } from "./chatApi";
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

        // Fetch the names for each chat and update the chat objects
        const chatsWithNames = await Promise.all(
          fetchedChats.map(async (chat) => {
            const name = await fetchNameFromChat(token, user.id, chat.id);
            return { ...chat, name }; // Add the name to each chat object
          })
        );

        setChats(chatsWithNames); // Set the resolved data to chats state
      } catch (error) {
        console.error("Error fetching chats or names:", error);
      }
    };

    fetchChatsData(); // Call the async function
  }, [token, user.id]);

  const handleChatCreated = () => {
    setShowModal(false);
    window.location.reload(); // Reload to show the new chat
  };

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
                to={`/chats/${chat.id}/${chat.name}`}
                className="custom-link"
              >
                <ListGroup.Item
                  key={chat.id}
                  className="custom-list-group-item"
                >
                  {chat.name || "Loading..."}
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
        onChatCreated={handleChatCreated}
      />
    </Container>
  );
};

export default AllChats;
