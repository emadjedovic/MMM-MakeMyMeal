import React, { useEffect, useState, useRef, useContext } from "react";
import { Form, Container, Row, Col } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../contexts/UserContext";
import { fetchMessagesFromChat } from "./chatApi";
import "./chat.css";
import ThemedButton from "../components/ThemedButton";

const Chat = () => {
  const { chatId, chatFirstName } = useParams();
  const navigate = useNavigate();
  const { user, token } = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [ws, setWs] = useState(null);

  const messageEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [shouldScroll, setShouldScroll] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const fetchedMessages = await fetchMessagesFromChat(token, chatId);
        setMessages(fetchedMessages || []);
      } catch (error) {
        console.error("Error in fetchMessages.");
        setMessages([]);
      }
    };

    fetchMessages();
  }, [chatId, token, messages]);

  useEffect(() => {
    const ws = new WebSocket(
      `ws://localhost:8000/ws/chat/${chatId}?token=${token}`
    );

    ws.onopen = () => {
      console.log("WebSocket connection established");
    };

    ws.onmessage = (event) => {
      console.log("Received message: ", event.data);
      const message = JSON.parse(event.data);
      setMessages((prevMessages) => {
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
        console.log(
          "ws.readyState before closing (useEffect return): ",
          ws.readyState
        );
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

      axios
        .post(
          `http://localhost:8000/api/chats/${chatId}/create-message/`,
          messageData
        )
        .then((response) => {
          if (ws) {
            ws.send(JSON.stringify(response.data.content));
            console.log("Message sent over WebSocket:", response.data.content);
            console.log("ws.readyState after ws.send: ", ws.readyState);
          }
          setNewMessage("");
        })
        .catch((error) => {
          console.error("Error in sendMessage.");
        });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      setShouldScroll(true);
      sendMessage();
    }
  };

  useEffect(() => {
    if (messagesContainerRef.current) {
      if (shouldScroll) {
        messagesContainerRef.current.scrollTop =
          messagesContainerRef.current.scrollHeight;
      }
    }
  }, [messages, shouldScroll]);

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        messagesContainerRef.current;
      if (scrollHeight - scrollTop === clientHeight) {
        setShouldScroll(true);
      } else {
        setShouldScroll(false);
      }
    }
  };

  return (
    <Container>
      <Row>
        <Col md={4} lg={4}>
          <ThemedButton
            variant="outline-dark"
            className="back-button"
            onClick={() => navigate("/chats")}
          >
            BACK TO ALL CHATS
          </ThemedButton>
        </Col>
        <Col md={8} lg={8}>
          <h4>Chat with {chatFirstName}</h4>
        </Col>
        <Col md={0} lg={2}></Col>
      </Row>
      <Row className="chat-row">
        <div
          className="chat"
          ref={messagesContainerRef}
          onScroll={handleScroll}
        >
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
          <ThemedButton
            onClick={sendMessage}
            variant="outline-dark"
            style={{ marginLeft: "1rem" }}
          >
            Send
          </ThemedButton>
        </div>
      </Row>
    </Container>
  );
};

export default Chat;
