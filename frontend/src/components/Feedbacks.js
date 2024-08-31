import React from "react";
import { Col, Row } from "react-bootstrap";
import FeedbackAccordion from "./FeedbackAccordion";

const Feedbacks = ({ feedbacks }) => {
  return (
    <Col md={6} className="mt-3">
      {feedbacks.length > 0 ? (
        feedbacks.map((feedback) => (
          <Row>
            <FeedbackAccordion feedback={feedback} />
          </Row>
        ))
      ) : (
        <p>No feedback available.</p>
      )}
    </Col>
  );
};

export default Feedbacks;
