import React, { useState, useEffect, useContext } from "react";
import {
  Table,
  Button,
  Container,
  Pagination,
  Row,
  Col,
  Form
} from "react-bootstrap";
import { formatCreatedAt } from "../calculations";
import { handleFetchRestaurantNamesFromOrders } from "../handlers/RestaurantPageHandlers";
import { handleUpdateOrderStatus } from "../handlers/DeliveryPageHandlers";
import { UserContext } from "../UserContext";

const OrdersTable = ({
  orders,
  handleOrderSelectParent,
  handleRestaurantSelectParent,
  refreshOrdersParent
}) => {
  
  const { user, userRole } = useContext(UserContext);
  const [editingStatus, setEditingStatus] = useState({}); // Track the selected status for each order

  const handleStatusChange = (orderId, newStatus) => {
    setEditingStatus((prev) => ({
      ...prev,
      [orderId]: newStatus,
    }));
  };

  const handleSaveStatus = (orderId) => {
    const newStatus = editingStatus[orderId];
    handleUpdateOrderStatus(user.token, orderId, newStatus)
      .then(() => {
        // Notify the parent to refresh the orders
        refreshOrdersParent();
      })
      .catch((error) => {
        console.error("Failed to update status:", error);
      });
  };

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
    handleFetchRestaurantNamesFromOrders(orders, setRestaurantNames, restaurantNames);
  }, [orders]);

  return (
    <Container className="my-4">
      <Row>
        <Col md={9} lg={9} xl={10}>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Restaurant</th>
                <th>Status</th>
                <th>Payment Method</th>
                <th>Total Price</th>
                <th>Created At</th>
                {userRole === "DELIVERY PERSONNEL" && <th>Actions</th>} {/* New column for Save button, only for delivery personnel */}
              </tr>
            </thead>
            <tbody>
            {currentItems.map((order) => {
                const isStatusChanged = editingStatus[order.id] && editingStatus[order.id] !== order.status;
                return (
                  <tr key={order.id}>
                    <td><Button
                        variant="link"
                        onClick={() =>
                          handleOrderSelectParent(order.id)
                        }
                      >
                        #{order.id}
                      </Button></td>
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
                      {userRole === "DELIVERY PERSONNEL" ? (
                        <Form.Control
                          as="select"
                          value={editingStatus[order.id] || order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        >
                          <option value="ASSIGNED">ASSIGNED</option>
                          <option value="IN_PROGRESS">IN PROGRESS</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </Form.Control>
                      ) : (
                        order.status
                      )}
                    </td>
                    <td>{order.payment_method}</td>
                    <td>€{order.total_price}</td>
                    <td>{formatCreatedAt(order.created_at)}</td>
                    {userRole === "DELIVERY PERSONNEL" && (
                      <td>
                        <Button
                          variant="primary"
                          onClick={() => handleSaveStatus(order.id)}
                          disabled={!isStatusChanged} // Disable if status is unchanged
                        >
                          Save
                        </Button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </Table>
          <Pagination>{paginationItems}</Pagination>
        </Col>
      </Row>
    </Container>
  );
};

export default OrdersTable;
