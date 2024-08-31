import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { Container, Tab, Nav, Row, Col, Modal, Button } from "react-bootstrap";
import CreatePersonnelForm from "../components/forms/CreatePersonnelForm";
import RARestaurantsTable from "../components/tables/RARestaurantsTable";
import RestaurantPage from "../components/RestaurantPage";
import AdminOrdersTable from "../components/tables/AdminOrdersTable";
import OrderModal from "../components/modals/OrderModal";
import {
  handleFetchRestaurantsByOwner,
  handleFetchRestaurantTypes,
  handleEditClick,
  handleSave,
  handleChange,
  handleFetchOrdersOwner,
  handleFetchFeedbacksOwner,
} from "../handlers/RestaurantAdminPageHandlers";
import { handleFetchMapOrders } from "../handlers/AdminPageHandlers";
import OrdersMap from "../components/OrdersMap";
import Feedbacks from "../components/Feedbacks";

const RestaurantAdminPage = () => {
  const { token, user } = useContext(UserContext);
  const [restaurants, setRestaurants] = useState([]);
  const [editableData, setEditableData] = useState({});
  const [editId, setEditId] = useState(null);
  const [restaurantTypes, setRestaurantTypes] = useState([]);
  const userId = user.id;
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
  const [selectedMap, setSelectedMap] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [ordersOwner, setOrdersOwner] = useState([]);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [feedbacksOwner, setFeedbacksOwner] = useState([]);

  useEffect(() => {
    handleFetchOrdersOwner(token, userId, setOrdersOwner);
  }, [token, userId]);

  useEffect(() => {
    handleFetchFeedbacksOwner(token, userId, setFeedbacksOwner);
  }, [token, userId]);

  const handleShowOrderModal = (orderId) => {
    setSelectedOrderId(orderId);
    setShowOrderModal(true);
  };

  const handleCloseOrderModal = () => {
    setShowOrderModal(false);
    setSelectedOrderId(null);
  };

  useEffect(() => {
    handleFetchRestaurantsByOwner(userId, token, setRestaurants);
    handleFetchRestaurantTypes(token, setRestaurantTypes);
  }, [userId, token]);

  const [selectedRestaurantName, setSelectedRestaurantName] = useState("");
  const [deliveryId, setDeliveryId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [ordersMap, setOrdersMap] = useState([]);

  useEffect(() => {
    if (selectedRestaurantName && date) {
      console.log("Fetching orders for:", {
        selectedRestaurantName,
        date,
        deliveryId,
      });
      handleFetchMapOrders(
        token,
        selectedRestaurantName,
        date,
        deliveryId,
        setOrdersMap
      ); // Assuming it can be reused for specific fetch
    }
  }, [selectedRestaurantName, date, deliveryId, token]);

  useEffect(() => {
    window.addEventListener("popstate", () => {
      setSelectedRestaurantId(null);
      setSelectedMap(false);
    });
    return () => {
      window.removeEventListener("popstate", () => {
        setSelectedRestaurantId(null);
        setSelectedMap(false);
      });
    };
  }, [selectedRestaurantId, selectedMap]);

  return (
    <Container>
      <Tab.Container defaultActiveKey="my-restaurants">
        <Nav variant="underline" className="mb-3">
          <Nav.Item
            onClick={() => {
              setSelectedRestaurantId(null);
              setSelectedMap(false);
            }}
          >
            <Nav.Link eventKey="my-restaurants">My Restaurants</Nav.Link>
          </Nav.Item>
          <Nav.Item
            onClick={() => {
              setSelectedRestaurantId(null);
              setSelectedMap(false);
            }}
          >
            <Nav.Link eventKey="personnel">Personnel</Nav.Link>
          </Nav.Item>
          <Nav.Item
            onClick={() => {
              setSelectedRestaurantId(null);
              setSelectedMap(false);
            }}
          >
            <Nav.Link eventKey="orders-table">Orders</Nav.Link>
          </Nav.Item>
          <Nav.Item
            onClick={() => {
              setSelectedRestaurantId(null);
              setSelectedMap(false);
            }}
          >
            <Nav.Link eventKey="customer-feedback">Customer Feedback</Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey="my-restaurants">
            {selectedRestaurantId ? (
              <RestaurantPage restaurantId={selectedRestaurantId} />
            ) : (
              <RARestaurantsTable
                restaurants={restaurants}
                editId={editId}
                editableData={editableData}
                handleEditClick={(id, data) =>
                  handleEditClick(id, data, setEditId, setEditableData)
                }
                handleChange={(e) =>
                  handleChange(e, editableData, setEditableData)
                }
                handleSave={(id) =>
                  handleSave(
                    id,
                    editableData,
                    token,
                    userId,
                    setEditId,
                    setEditableData,
                    setRestaurants
                  )
                }
                restaurantTypes={restaurantTypes}
                handleRestaurantSelectParent={(restaurantId) =>
                  setSelectedRestaurantId(restaurantId)
                }
              />
            )}
          </Tab.Pane>
          <Tab.Pane eventKey="personnel">
            <CreatePersonnelForm />
          </Tab.Pane>
          <Tab.Pane eventKey="orders-table">
            {selectedRestaurantId ? (
              <RestaurantPage restaurantId={selectedRestaurantId} />
            ) : selectedMap ? (
              <OrdersMap
                restaurants={restaurants}
                selectedRestaurantName={selectedRestaurantName}
                deliveryId={deliveryId}
                date={date}
                orders={ordersMap}
                setSelectedRestaurantName={setSelectedRestaurantName}
                setDeliveryId={setDeliveryId}
                setDate={setDate}
              />
            ) : (
              <>
                <Row>
                  <Col>
                    <AdminOrdersTable
                      orders={ordersOwner}
                      handleOrderSelectParent={(orderId) =>
                        handleShowOrderModal(orderId)
                      }
                      handleRestaurantSelectParent={(restaurantId) =>
                        setSelectedRestaurantId(restaurantId)
                      }
                      handleMapSelectParent={() => setSelectedMap(true)}
                      refreshOrdersParent={() =>
                        handleFetchOrdersOwner(token, userId, setOrdersOwner)
                      }
                    />
                  </Col>
                </Row>
                {showOrderModal && (
                  <Modal show={showOrderModal} onHide={handleCloseOrderModal}>
                    <Modal.Header closeButton>
                      <Modal.Title>Order Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <OrderModal
                        orderId={selectedOrderId}
                        showModal={showOrderModal}
                        handleClose={handleCloseOrderModal}
                      />
                    </Modal.Body>
                    <Modal.Footer>
                      <Button
                        variant="secondary"
                        onClick={handleCloseOrderModal}
                      >
                        Close
                      </Button>
                    </Modal.Footer>
                  </Modal>
                )}
              </>
            )}
          </Tab.Pane>

          <Tab.Pane eventKey="customer-feedback">
            <Feedbacks feedbacks={feedbacksOwner} />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
};

export default RestaurantAdminPage;
