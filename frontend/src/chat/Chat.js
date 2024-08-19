import React, { useEffect, useState, useRef, useContext } from 'react';
import { Form, Button, InputGroup, Container, Row, Col } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import Message from './Message';
import { UserContext } from '../UserContext';
import { fetchMessagesFromChat } from './chatApi';
import axios from 'axios';
import './chat.css'; // Import the CSS file

const Chat = () => {
  const { chatId, chatName } = useParams(); // Extract chatId from URL parameters
  const navigate = useNavigate(); // Initialize the navigate function
  const { user, token } = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [ws, setWs] = useState(null);
  const messageEndRef = useRef(null);

  useEffect(() => {
    // Fetch existing messages from the API
    const fetchMessages = async () => {
      try {
        const fetchedMessages = await fetchMessagesFromChat(token, chatId);
        setMessages(fetchedMessages || []); // Ensure messages is an array
      } catch (error) {
        console.error("Error fetching messages:", error);
        setMessages([]); // Set to an empty array on error
      }
    };

    fetchMessages(); // Call the async function

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
  }, [chatId, token]);

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
    <Container>
      <Row>
      <Col>
          <Button variant="outline-dark" className="back-button" onClick={() => navigate('/chats')}>
            Back to Chats
          </Button>
        </Col>
      </Row>
      <Row className="m-3 p-4" style={{border: "1px solid #ccc", borderRadius: "3rem"}}>
        <div className="chat">
          {Array.isArray(messages) && messages.map((message, index) => (
            <div
              key={index}
              className={`message-card ${message.sender_id === user.id ? 'own' : 'others'}`}
            >
              <p className="message-content">{message.content}</p>
            </div>
          ))}
          <div ref={messageEndRef} />
        </div>
        <div className="message-input-group">
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
        </div>
      </Row>
    </Container>
  );
};

export default Chat;
