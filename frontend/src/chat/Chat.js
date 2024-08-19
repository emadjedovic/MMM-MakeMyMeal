// src/components/Chat.js

import React, { useEffect, useState, useRef, useContext } from 'react';
import { Form, Button, InputGroup, Container, Row, Col } from 'react-bootstrap';
import Message from './Message';
import { UserContext } from '../UserContext';
import { fetchMessagesFromChat } from './chatApi';
import axios from 'axios';

const Chat = ({ chatId }) => {
  const { user, token } = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [ws, setWs] = useState(null);
  const messageEndRef = useRef(null);

  useEffect(() => {
    // Fetch existing messages from the API
    const messages = fetchMessagesFromChat(token, chatId)
    setMessages(messages);

    // Establish WebSocket connection
    const ws = new WebSocket(`ws://localhost:8000/ws/chat/${chatId}`);
    setWs(ws);

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    ws.onclose = () => {
      console.log('WebSocket closed');
    };

    return () => {
      ws.close();
    };
  }, [chatId]);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const messageData = {
        content: newMessage,
        sender_id: user.id,
      };

      // Send message to the API
      axios.post(`http://localhost:8000/api/chats/${chatId}/messages/`, messageData)
        .then(response => {
          // Send message over WebSocket to notify other clients
          if (ws) {
            ws.send(JSON.stringify(response.data));
          }
          setNewMessage('');
        })
        .catch(error => {
          console.error("Error sending message:", error);
        });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <Container className="d-flex flex-column" style={{ height: '100vh' }}>
      <Row className="flex-grow-1 overflow-auto">
        <Col>
          {messages.map((message, index) => (
            <Message
              key={index}
              message={message}
              isOwnMessage={message.sender_id === user.id}
            />
          ))}
          <div ref={messageEndRef} />
        </Col>
      </Row>
      <Row>
        <Col>
          <InputGroup>
            <Form.Control
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
            />
            <Button onClick={sendMessage} variant="primary">
              Send
            </Button>
          </InputGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default Chat;
