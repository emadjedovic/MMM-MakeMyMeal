import React, { useState, useEffect, useContext } from "react";
import {
  Table,
  Container,
  Pagination,
  Row,
  Col,
  Form,
  Button,
} from "react-bootstrap";
import { formatCreatedAt } from "../../calculations.js";
import { handleFetchRestaurantNamesFromOrders } from "../../handlers/RestaurantPageHandlers.js";
import { handleUpdateOrderStatus } from "../../handlers/DeliveryPageHandlers.js";
import { UserContext } from "../../contexts/UserContext.js";
import { createNotification } from "../../api/notificationsApi.js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NotificationsContext } from "../../contexts/NotificationsContext.js";
import OrderLocationMap from "../OrderLocationMap.js";

const DPOrdersTable = ({
  orders,
  handleOrderSelectParent,
  handleRestaurantSelectParent,
  refreshOrdersParent,
}) => {
  const { user, token } = useContext(UserContext);
  const [selectedOrderStatuses, setSelectedOrderStatuses] = useState({});
  const { setNewNotification } = useContext(NotificationsContext);

  const handleStatusChange = (orderId, status) => {
    setSelectedOrderStatuses((prevStatuses) => ({
      ...prevStatuses,
      [orderId]: status,
    }));
  };

  const handleSaveStatus = async (orderId) => {
    const status = selectedOrderStatuses[orderId];
    try {
      console.log("sending orderId via handler: ", orderId);
      console.log("sending status via handler: ", status);
      await handleUpdateOrderStatus(token, orderId, status);
      refreshOrdersParent();

      const selectedOrder = orders.find((order) => order.id === orderId);
      const notificationData = {
        user_id: user.id,
        restaurant_id: selectedOrder.restaurant_id,
        order_id: orderId,
        type: status,
        message: `Order #${orderId} status updated to ${status}.`,
      };

      await createNotification(token, notificationData);
      setNewNotification(true);

      toast.success("Status updated successfully!");
    } catch (error) {
      console.error("Error in handleSaveStatus.");
    }
  };

  useEffect(() => {
    const initialStatuses = orders.reduce((acc, order) => {
      acc[order.id] = order.status;
      return acc;
    }, {});
    console.log("Initial statuses: ", initialStatuses);
    setSelectedOrderStatuses(initialStatuses);
  }, [orders]);

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [restaurantNames, setRestaurantNames] = useState({});

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const sortedOrders = [...orders].sort(
    (a, b) =>
      new Date(b.preferred_arrival_time) - new Date(a.preferred_arrival_time)
  );
  const currentItems = sortedOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const paginationItems = [];
  for (let number = 1; number <= totalPages; number++) {
    paginationItems.push(
      <Pagination.Item
        key={number}
        active={number === currentPage}
        onClick={() => setCurrentPage(number)}
      >
        {number}
      </Pagination.Item>
    );
  }

  useEffect(() => {
    handleFetchRestaurantNamesFromOrders(
      orders,
      setRestaurantNames,
      restaurantNames
    );
  }, [orders]);

  // for map modal

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderLocationModal, setShowOrderLocationModal] = useState(false);

  const handleLocationClick = (order) => {
    setSelectedOrder(order);
    setShowOrderLocationModal(true);
  };

  return (
    <Container className="my-4">
      <Row>
        <Col>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Order</th>
                <th>Restaurant</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Location</th>
                <th>Total Price</th>
                <th>Arrival Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((order) => (
                <tr key={order.id}>
                  <td>
                    <Button
                      variant="link"
                      onClick={() => handleOrderSelectParent(order.id)}
                    >
                      #{order.id}
                    </Button>
                  </td>
                  <td>
                    <Button
                      variant="link"
                      onClick={() =>
                        handleRestaurantSelectParent(order.restaurant_id)
                      }
                    >
                      {restaurantNames[order.restaurant_id] || "Loading..."}
                    </Button>
                  </td>
                  <td>
                    <Form.Check
                      type="radio"
                      label="ASSIGNED"
                      name={`status-${order.id}`}
                      id={`assigned-${order.id}`}
                      checked={selectedOrderStatuses[order.id] === "ASSIGNED"}
                      onChange={() => handleStatusChange(order.id, "ASSIGNED")}
                    />
                    <Form.Check
                      type="radio"
                      label="IN PROGRESS"
                      name={`status-${order.id}`}
                      id={`in-progress-${order.id}`}
                      checked={
                        selectedOrderStatuses[order.id] === "IN PROGRESS"
                      }
                      onChange={() =>
                        handleStatusChange(order.id, "IN PROGRESS")
                      }
                    />
                    <Form.Check
                      type="radio"
                      label="COMPLETED"
                      name={`status-${order.id}`}
                      id={`completed-${order.id}`}
                      checked={selectedOrderStatuses[order.id] === "COMPLETED"}
                      onChange={() => handleStatusChange(order.id, "COMPLETED")}
                    />
                  </td>
                  <td>{order.payment_method}</td>
                  <td
                    onClick={() => handleLocationClick(order)}
                    style={{ cursor: "pointer" }}
                  >
                    <Row>
                      <Col>
                        {order.latitude.toFixed(5)}
                        <br></br>
                        {order.longitude.toFixed(5)}
                      </Col>
                      <Col>
                        <img
                          src="./globe.png"
                          alt="Map of Orders"
                          style={{
                            width: "2rem",
                            height: "2rem",
                            marginTop: "0.5rem",
                            cursor: "pointer",
                          }}
                        />
                      </Col>
                    </Row>
                  </td>
                  <td>€{order.total_price}</td>
                  <td>{formatCreatedAt(order.preferred_arrival_time)}</td>
                  <td>
                    <Button
                      variant="primary"
                      onClick={() => handleSaveStatus(order.id)}
                      disabled={
                        selectedOrderStatuses[order.id] === order.status
                      }
                    >
                      Save
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {selectedOrder && (
            <OrderLocationMap
              show={showOrderLocationModal}
              onHide={() => setShowOrderLocationModal(false)}
              order={selectedOrder}
            />
          )}
          <Pagination>{paginationItems}</Pagination>
        </Col>
      </Row>
    </Container>
  );
};

export default DPOrdersTable;
