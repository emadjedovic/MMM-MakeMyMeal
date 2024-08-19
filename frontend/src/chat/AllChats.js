// src/components/AllChats.js

import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ListGroup, Container, Row, Col } from 'react-bootstrap';
import { UserContext } from '../UserContext';
import { fetchChats, fetchNameFromChat } from './chatApi';

const AllChats = () => {
  const { token, user } = useContext(UserContext);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    // Fetch list of chats connected to the current user
    const fetchChatsData = async () => {
      try {
        const fetchedChats = await fetchChats(token, user.id); // Wait for the API call to resolve
        setChats(fetchedChats); // Set the resolved data to chats state
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    fetchChatsData(); // Call the async function
  }, [token, user.id]);

  const handleFetchNameFromChat = async (chatId) => {
    try {
      const name = await fetchNameFromChat(token, user.id, chatId);
      return name
    } catch (error) {
      console.error("error.")
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          <h3>Your Chats</h3>
          <ListGroup>
            {chats.map(chat => (
              <ListGroup.Item key={chat.id}>
                <Link to={`/chats/${chat.id}`}>{(chat) => handleFetchNameFromChat(chat.id)}</Link>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default AllChats;
