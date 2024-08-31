import React from "react";
import { Accordion, Col } from "react-bootstrap";
import { formatCreatedAt } from "../calculations";

const FeedbackAccordion = ({ feedback }) => {
  return (
    <Accordion defaultActiveKey="0">
      <Accordion.Header
        eventKey="0"
        style={{ fontFamily: "calibri, Arial" }}
        flush
      >
        <Col className="mx-3">
          <h5 className="m-1">
            <strong>Order #{feedback.order_id}</strong>
          </h5>
          <i style={{ color: "gray" }}>{formatCreatedAt(feedback.timestamp)}</i>
        </Col>
      </Accordion.Header>
      <Accordion.Body>
        {feedback ? (
          <>
            <p>
              <strong>Restaurant Rating:</strong> {feedback.restaurant_rating}
            </p>
            <p>
              <strong>Delivery Rating:</strong> {feedback.delivery_rating}
            </p>
            <p>
              <strong>Would Recommend:</strong>{" "}
              {feedback.would_recommend ? "Yes" : "No"}
            </p>
            <p>
              <strong>Feedback:</strong> {feedback.feedback || "None"}
            </p>
          </>
        ) : (
          <p>No feedback available for this order.</p>
        )}
      </Accordion.Body>
    </Accordion>
  );
};

export default FeedbackAccordion;
