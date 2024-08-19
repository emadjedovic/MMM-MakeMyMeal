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

  return (
    <Container>
      <Row>
        <Col>
          <h3>Your Chats</h3>
          <ListGroup>
            {chats.map(chat => (
              <ListGroup.Item key={chat.id}>
                <Link to={`/chats/${chat.id}/${chat.name}`}>{chat.name || 'Loading...'}</Link>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default AllChats;
