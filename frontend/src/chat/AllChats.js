import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { ListGroup, Container, Row, Col } from "react-bootstrap";
import { UserContext } from "../contexts/UserContext.js";
import { fetchChats, fetchUserInfoFromChat } from "./chatApi";
import CreateChatModal from "./CreateChatModal.js";
import "./chat.css";
import ThemedButton from "../components/ThemedButton.js";

const AllChats = () => {
  const { token, user } = useContext(UserContext);
  const [chats, setChats] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const handleFetchChats = async () => {
      try {
        const fetchedChats = await fetchChats(token, user.id);

        const chatsWithInfo = await Promise.all(
          fetchedChats.map(async (chat) => {
            const userInfo = await fetchUserInfoFromChat(
              token,
              user.id,
              chat.id
            );
            return {
              ...chat,
              firstName: userInfo.first_name,
              lastName: userInfo.last_name,
              role: userInfo.role,
              userId: userInfo.id,
            };
          })
        );

        setChats(chatsWithInfo);
      } catch (error) {
        console.error("Error in handleFetchChats.");
      }
    };

    handleFetchChats();
  }, [token, user.id, showModal, setChats]);

  const handleChatCreated = () => {
    setShowModal(false);
  };

  const existingChatUsers = chats.map((chat) => chat.userId);

  return (
    <Container>
      <Row>
        <Col>
          <h1>INBOX</h1>
          <ThemedButton
            variant="outline-dark"
            onClick={() => setShowModal(true)}
          >
            Create New Chat
          </ThemedButton>
          <br />
          <br />
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
        existingChatUsers={existingChatUsers}
      />
    </Container>
  );
};

export default AllChats;
