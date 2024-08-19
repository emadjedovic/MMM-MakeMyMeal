import React from 'react';
import { Card } from 'react-bootstrap';

const Message = ({ message, isOwnMessage }) => {
  return (
    <Card
      className={`my-2 ${isOwnMessage ? 'align-self-end bg-primary text-white' : 'align-self-start bg-light text-dark'}`}
      style={{ maxWidth: '75%' }}
    >
      <Card.Body>
        <Card.Text>{message.content}</Card.Text>
        <Card.Subtitle className="text-muted small">
          {message.timestamp} - {message.sender}
        </Card.Subtitle>
      </Card.Body>
    </Card>
  );
};

export default Message;
