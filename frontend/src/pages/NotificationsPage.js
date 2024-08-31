import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../contexts/UserContext.js";
import {
  handleFetchNotificationsOwner,
  handleDeleteNotification,
  handleDeleteAllNotifications,
} from "../handlers/NotificationPageHandlers.js";
import {
  Container,
  Row,
  Col,
  Alert,
  Toast,
  CloseButton,
  Button,
} from "react-bootstrap";
import {
  FaInfoCircle,
  FaExclamationCircle,
  FaCheckCircle,
  FaQuestionCircle,
} from "react-icons/fa";
import { NotificationsContext } from "../contexts/NotificationsContext.js";

const NotificationsPage = () => {
  const { token, user } = useContext(UserContext);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    handleFetchNotificationsOwner(token, setNotifications, user.id);
  }, [token]);

  const { markNotificationsAsRead } = useContext(NotificationsContext);

  useEffect(() => {
    markNotificationsAsRead();
  }, []);

  const getNotificationColor = (type) => {
    switch (type) {
      case "IN PROGRESS":
        return "#a3c9e5";
      case "NEW_ORDER":
        return "#fdfd96";
      case "COMPLETED":
        return "#b2e5a8";
      default:
        return "#f8f9fa";
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "IN PROGRESS":
        return <FaInfoCircle />;
      case "NEW_ORDER":
        return <FaExclamationCircle />;
      case "COMPLETED":
        return <FaCheckCircle />;
      default:
        return <FaQuestionCircle />;
    }
  };

  const sortedNotifications = [...notifications].sort(
    (a, b) =>
      // sort by timestamp (earlier notifications should be on top)
      new Date(b.timestamp) - new Date(a.timestamp)
  );

  return (
    <Container>
      <Row className="my-5">
        <Col sm={10} md={8}>
          {notifications.length === 0 ? (
            <Alert variant="info">No notifications available</Alert>
          ) : (
            <div>
              {sortedNotifications.map((notification) => (
                <Toast
                  key={notification.id}
                  className="m-3"
                  style={{
                    width: "90%",
                    padding: "0.5rem",
                    fontSize: "medium",
                    backgroundColor: getNotificationColor(notification.type),
                  }}
                >
                  <Toast.Header closeButton={false}>
                    {getNotificationIcon(notification.type)}&nbsp;
                    <strong className="me-auto">
                      {new Date(notification.timestamp).toLocaleString()}
                    </strong>
                    <CloseButton
                      onClick={() =>
                        handleDeleteNotification(
                          token,
                          notification.id,
                          notifications,
                          setNotifications
                        )
                      }
                    />
                  </Toast.Header>
                  <Toast.Body>
                    {notification.message} <br />
                  </Toast.Body>
                </Toast>
              ))}
            </div>
          )}
        </Col>
        <Col sm={2} md={4}>
          <Row>
            <h2>
              <i>Notifications</i>
            </h2>
          </Row>
          <Row>
            <Button
              variant="danger"
              onClick={() =>
                handleDeleteAllNotifications(token, setNotifications)
              }
              style={{ width: "80%", fontSize: "large", marginLeft: "1rem" }}
            >
              DELETE ALL
            </Button>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default NotificationsPage;
