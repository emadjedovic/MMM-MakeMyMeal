import React, { useEffect, useState, useRef } from 'react';
import { Form, Button, InputGroup, Container, Row, Col } from 'react-bootstrap';
import Message from './Message';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ChatPage = ({ user }) => {
  const { chatId } = useParams();  // Assuming chatId is passed as a URL parameter
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [ws, setWs] = useState(null);
  const messageEndRef = useRef(null);

  useEffect(() => {
    // Fetch existing messages from the API
    axios.get(`/api/chats/${chatId}/messages/`)
      .then(response => {
        setMessages(response.data);
      })
      .catch(error => {
        console.error("Error fetching messages:", error);
      });

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
      axios.post(`/api/chats/${chatId}/messages/`, messageData)
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

export default ChatPage;
