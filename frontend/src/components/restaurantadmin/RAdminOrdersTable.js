import React, { useState, useEffect, useContext } from "react";
import {
  Table,
  Button,
  Container,
  Pagination,
  Row,
  Col,
} from "react-bootstrap";
import { formatCreatedAt } from "../../calculations";
import { handleFetchRestaurantNamesFromOrders } from "../../handlers/RestaurantPageHandlers";
import { UserContext } from "../../UserContext";
import AssignOrderModal from "./AssignOrderModal";

const RAdminsOrdersTable = ({
  orders,
  handleOrderSelectParent,
  handleRestaurantSelectParent,
  refreshOrdersParent,
}) => {
  const { user } = useContext(UserContext);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const handleOpenModal = (orderId) => {
    setSelectedOrderId(orderId);
    setShowModal(true);
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
                <th>Payment</th>
                <th>Location</th>
                <th>Total Price</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((order) => {
                const isUnassigned = order.status === "UNASSIGNED"; // For restaurant admin

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
                      {isUnassigned ? (
                        <Button
                          variant="link"
                          onClick={() => handleOpenModal(order.id)}
                        >
                          {order.status}
                        </Button>
                      ) : (
                        order.status
                      )}
                    </td>
                    <td>{order.payment_method}</td>
                    <td>({order.latitude.toFixed(5)}, {order.longitude.toFixed(5)})</td>
                    <td>€{order.total_price}</td>
                    <td>{formatCreatedAt(order.created_at)}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          <Pagination>{paginationItems}</Pagination>
        </Col>
      </Row>

      {/* Assign Order Modal */}
      <AssignOrderModal
        show={showModal}
        closeModal={() => setShowModal(false)}
        orderId={selectedOrderId}
        token={user.token}
        refreshOrdersParent={refreshOrdersParent}
      />
    </Container>
  );
};

export default RAdminsOrdersTable;
