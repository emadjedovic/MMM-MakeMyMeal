import React from "react";
import { Card } from "react-bootstrap";
import "./chat.css";
import { formatCreatedAt } from "../calculations";

const Message = ({ message, isOwnMessage }) => {
  return (
    <Card className={`message-card ${isOwnMessage ? "own" : "others"}`}>
      <Card.Body className="message-content">
        <Card.Text>{message.content}</Card.Text>
        <Card.Subtitle
          className={`mt-1 message-timestamp ${
            isOwnMessage ? "own" : "others"
          }`}
        >
          {formatCreatedAt(message.timestamp)}
        </Card.Subtitle>
      </Card.Body>
    </Card>
  );
};

export default Message;
