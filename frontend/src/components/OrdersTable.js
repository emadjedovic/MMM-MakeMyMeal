import React, { useState, useEffect, useContext } from "react";
import {
  Table,
  Button,
  Container,
  Pagination,
  Row,
  Col,
  Form,
  Modal,
} from "react-bootstrap";
import { formatCreatedAt } from "../calculations";
import { handleFetchRestaurantNamesFromOrders } from "../handlers/RestaurantPageHandlers";
import { handleUpdateOrderStatus } from "../handlers/DeliveryPageHandlers";
import { UserContext } from "../UserContext";

const OrdersTable = ({
  orders,
  handleOrderSelectParent,
  handleRestaurantSelectParent,
  refreshOrdersParent,
}) => {
  const { user, userRole } = useContext(UserContext);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // delivery personnel status update
  const [newStatus, setNewStatus] = useState("");
  const [statusModal, setStatusModal] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("");


  const handleOpenStatusModal = (orderId, status) => {
    setSelectedOrderId(orderId);
    setCurrentStatus(status); // Set the current status of the selected order
    setNewStatus(status); // Set the new status to the current status initially
    setStatusModal(true);
  };

  const handleStatusChange = async (status) => {
    try {
      await handleUpdateOrderStatus(user.token, selectedOrderId, status);
      console.log(`Order ${selectedOrderId} status updated to ${status}`);
      setStatusModal(false);
      refreshOrdersParent(); // Refresh the orders after updating the status
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  // Determine the available status options based on the current status
  const getStatusOptions = () => {
    switch (currentStatus) {
      case "IN PROGRESS":
        return (
          <>
            <option value="">Choose...</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CANCELLED">CANCELLED</option>
          </>
        );
      default:
        return (
          <>
            <option value="">Choose...</option>
            <option value="IN_PROGRESS">IN PROGRESS</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CANCELLED">CANCELLED</option>
          </>
        );
    }
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
                <th>Order ID</th>
                <th>Restaurant</th>
                <th>Status</th>
                <th>Payment Method</th>
                <th>Total Price</th>
                <th>Created At</th>
                {userRole === "DELIVERY PERSONNEL" && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {currentItems.map((order) => {

                return (
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
                        order.status
                    </td>
                    <td>{order.payment_method}</td>
                    <td>€{order.total_price}</td>
                    <td>{formatCreatedAt(order.created_at)}</td>
                    {userRole === "DELIVERY PERSONNEL" && (
                      <td>
                        <Button
                          variant="primary"
                          onClick={() =>
                            handleOpenStatusModal(order.id, order.status)
                          }
                        >
                          Change Status
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

      {/* Status Change Modal */}
      <Modal show={statusModal} onHide={() => setStatusModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Change Order Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formStatus">
              <Form.Label>Select New Status</Form.Label>
              <Form.Control
                as="select"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                {getStatusOptions()}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setStatusModal(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => handleStatusChange(newStatus)}
            disabled={newStatus === currentStatus || newStatus === ""}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default OrdersTable;
