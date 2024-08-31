import React, { useState, useEffect, useContext } from "react";
import {
  Table,
  Container,
  Pagination,
  Row,
  Col,
  Button,
} from "react-bootstrap";
import { formatCreatedAt } from "../../calculations";
import { handleFetchRestaurantNamesFromOrders } from "../../handlers/RestaurantPageHandlers";
import { UserContext } from "../../contexts/UserContext";
import RateServiceModal from "../modals/RateServiceModal";

const OrdersTable = ({
  orders,
  handleOrderSelectParent,
  handleRestaurantSelectParent,
}) => {
  const { token } = useContext(UserContext);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [showRateServiceModal, setShowRateServiceModal] = useState(false);

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [restaurantNames, setRestaurantNames] = useState({});

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
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

  const handleOpenRateServiceModal = (orderId) => {
    setSelectedOrderId(orderId);
    setShowRateServiceModal(true);
  };

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
                <th>Payment</th>
                <th>Total Price</th>
                <th>Created At</th>
                <th>Feedback</th>
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
                    <td>{order.status}</td>
                    <td>{order.payment_method}</td>
                    <td>€{order.total_price}</td>
                    <td>{formatCreatedAt(order.created_at)}</td>
                    <td>
                      <Button
                        variant="primary"
                        onClick={() => handleOpenRateServiceModal(order.id)}
                        disabled={order.status !== "COMPLETED"}
                      >
                        Rate Service
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          <Pagination>{paginationItems}</Pagination>
        </Col>
      </Row>
      <RateServiceModal
        show={showRateServiceModal}
        closeModal={() => setShowRateServiceModal(false)}
        orderId={selectedOrderId}
        token={token}
      />
    </Container>
  );
};

export default OrdersTable;
