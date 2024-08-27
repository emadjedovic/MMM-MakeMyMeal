import React, { useState, useEffect, useContext } from "react";
import {
  Table,
  Container,
  Pagination,
  Row,
  Col,
  OverlayTrigger,
  Tooltip,
  Button,
} from "react-bootstrap";
import { formatCreatedAt } from "../../calculations";
import { handleFetchRestaurantNamesFromOrders } from "../../handlers/RestaurantPageHandlers";
import { UserContext } from "../../contexts/UserContext";
import AssignOrderModal from "../modals/AssignOrderModal";
import OrderLocationMap from "../OrderLocationMap";

const AdminOrdersTable = ({
  orders,
  handleOrderSelectParent,
  handleRestaurantSelectParent,
  handleMapSelectParent,
  refreshOrdersParent,
}) => {
  const { user, userRole } = useContext(UserContext);
  const [showAssignOrderModal, setShowAssignOrderModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const handleOpenModal = (orderId) => {
    setSelectedOrderId(orderId);
    setShowAssignOrderModal(true);
  };

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
        <Col md={10} lg={11} xl={11}>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Restaurant</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Location</th>
                <th>Price</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((order) => {
                const isUnassigned = order.status === "UNASSIGNED";

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
                      {userRole === "RESTAURANT ADMIN" && isUnassigned ? (
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
                    <td>{formatCreatedAt(order.created_at)}</td>
                  </tr>
                );
              })}
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
        <Col
          md={2}
          lg={1}
          xl={1}
          className="d-flex align-items-center justify-content-center"
        >
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id="map-tooltip">View Map of Orders</Tooltip>}
          >
            <img
              src="./globe.png"
              alt="Map of Orders"
              onClick={() => handleMapSelectParent()}
              style={{
                position: "fixed",
                top: "6rem",
                right: "40px",
                width: "4rem",
                height: "4rem",
                cursor: "pointer",
                zIndex: 1000,
              }}
            />
          </OverlayTrigger>
        </Col>
      </Row>
      <AssignOrderModal
        show={showAssignOrderModal}
        closeModal={() => setShowAssignOrderModal(false)}
        orderId={selectedOrderId}
        token={user.token}
        refreshOrdersParent={refreshOrdersParent}
      />
    </Container>
  );
};

export default AdminOrdersTable;
