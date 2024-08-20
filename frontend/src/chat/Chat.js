import React, { useEffect, useState, useRef, useContext } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../UserContext";
import { fetchMessagesFromChat } from "./chatApi";
import "./chat.css"; // Import the CSS file

const Chat = () => {
  const { chatId, chatName } = useParams(); // Extract chatId from URL parameters
  const navigate = useNavigate(); // Initialize the navigate function
  const { user, token } = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
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
    const ws = new WebSocket(`ws://localhost:8000/ws/chat/${chatId}?token=${token}`);

    ws.onopen = () => {
      console.log("WebSocket connection established");
    };

    ws.onmessage = (event) => {
      console.log("Received message: ", event.data);
      const message = JSON.parse(event.data);
      setMessages((prevMessages) => {
        // Check if message already exists in state
        if (!prevMessages.some((msg) => msg.id === message.id)) {
          return [...prevMessages, message];
        }
        return prevMessages;
      });
    };

    ws.onclose = (event) => {
      console.log("WebSocket connection closed.");
    };

    setWs(ws);

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        console.log("ws.readyState before closing (useEffect return): ", ws.readyState)
          ws.close();
      }
  };
  }, [chatId, token]);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const messageData = {
        content: newMessage,
        sender_id: user.id,
      };

      // Send message to the API
      axios
        .post(`http://localhost:8000/api/chats/${chatId}/create-message/`, messageData)
        .then((response) => {
          // Send message over WebSocket to notify other clients
          if (ws) {
            ws.send(JSON.stringify(response.data.content));
            console.log("Message sent over WebSocket:", response.data.content);
            console.log("ws.readyState after ws.send: ", ws.readyState)
          }
          setNewMessage("");
        })
        .catch((error) => {
          console.error("Error sending message:", error);
        });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <Container>
      <Row>
        <Col md={4} lg={2}>
          <Button
            variant="outline-dark"
            className="back-button"
            onClick={() => navigate("/chats")}
          >
            Back to Chats
          </Button>
        </Col>
        <Col md={8} lg={10}>
          <h4>
            <i>CHAT WITH {chatName}</i>
          </h4>
        </Col>
        <Col md={0} lg={2}></Col>
      </Row>
      <Row className="chat-row">
        <div className="chat">
          {Array.isArray(messages) &&
            messages.map((message, index) => (
              <div
                key={index}
                className={`message-card ${
                  message.sender_id === user.id ? "own" : "others"
                }`}
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
