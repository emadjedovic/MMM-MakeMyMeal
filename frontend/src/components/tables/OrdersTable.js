import React, { useState, useEffect, useContext } from "react";
import {
  Table,
  Button,
  Container,
  Pagination,
  Row,
  Col,
  Form,
} from "react-bootstrap";
import { formatCreatedAt } from "../../calculations";
import { handleFetchRestaurantNamesFromOrders } from "../../handlers/RestaurantPageHandlers";
import { handleUpdateOrderStatus } from "../../handlers/DeliveryPageHandlers";
import { UserContext } from "../../UserContext";
import { createNotification } from "../../api/notificationsApi.js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NotificationsContext } from "../../NotificationsContext.js";

const OrdersTable = ({
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
      console.log("sending orderId via handler: ", orderId)
      console.log("sending status via handler: ", status)
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
      console.error("Error updating order status:", error);
    }
  };

  useEffect(() => {
    const initialStatuses = orders.reduce((acc, order) => {
      acc[order.id] = order.status;
      return acc;
    }, {});
    console.log("Initial statuses: ", initialStatuses); // Debugging line
    setSelectedOrderStatuses(initialStatuses);
  }, [orders]);

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [restaurantNames, setRestaurantNames] = useState({});

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = orders.slice(indexOfFirstItem, indexOfLastItem);
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

  return (
    <Container className="my-4">
      <Row>
        <Col md={9} lg={9} xl={10}>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Order</th>
                <th>Restaurant</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Location</th>
                <th>Total Price</th>
                <th>Created At</th>
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
                      onChange={() =>
                        handleStatusChange(order.id, "ASSIGNED")
                      }
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
                      onChange={() =>
                        handleStatusChange(order.id, "COMPLETED")
                      }
                    />
                  </td>
                  <td>{order.payment_method}</td>
                  <td>
                    ({order.latitude.toFixed(5)}, {order.longitude.toFixed(5)})
                  </td>
                  <td>€{order.total_price}</td>
                  <td>{formatCreatedAt(order.created_at)}</td>
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
          <Pagination>{paginationItems}</Pagination>
        </Col>
      </Row>
    </Container>
  );
};

export default OrdersTable;
