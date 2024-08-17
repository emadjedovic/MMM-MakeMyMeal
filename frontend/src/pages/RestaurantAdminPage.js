import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { Container, Tab, Nav, Pagination, Row, Col, Modal, Button } from "react-bootstrap";
import "../css/App.css";

import CreatePersonnelForm from "../components/forms/CreatePersonnelForm";
import RAdminRestaurantsTable from "../components/tables/RAdminRestaurantsTable";
import RestaurantPage from "../components/RestaurantPage";
import RAdminOrdersTable from "../components/tables/RAdminOrdersTable";
import OrderModal from "../components/modals/OrderModal";

import {
  handleFetchRestaurantsByOwner,
  handleFetchRestaurantTypes,
  handleEditClick,
  handleSave,
  handleChange,
  handleFetchOrdersOwner
} from "../handlers/RestaurantAdminPageHandlers";

const RestaurantAdminPage = () => {
  const { token, user } = useContext(UserContext);
  const [restaurants, setRestaurants] = useState([]);
  const [editableData, setEditableData] = useState({});
  const [editId, setEditId] = useState(null);
  const [restaurantTypes, setRestaurantTypes] = useState([]);
  const userId = user.id;
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);

  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [ordersOwner, setOrdersOwner] = useState([]);
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    handleFetchOrdersOwner(token, userId, setOrdersOwner);
  }, [token, userId]);

  const handleShowOrderModal = (orderId) => {
    setSelectedOrderId(orderId);
    setShowOrderModal(true);
  };

  const handleCloseOrderModal = () => {
    setShowOrderModal(false);
    setSelectedOrderId(null);
  };

  const indexOfLastRestaurant = currentPage * itemsPerPage;
  const indexOfFirstRestaurant = indexOfLastRestaurant - itemsPerPage;
  const currentRestaurants = restaurants.slice(
    indexOfFirstRestaurant,
    indexOfLastRestaurant
  );

  const totalPages = Math.ceil(restaurants.length / itemsPerPage);
  const paginationItems = [];
  for (let number = 1; number <= totalPages; number++) {
    paginationItems.push(
      <Pagination.Item
        key={number}
        active={number === currentPage}
        onClick={(pageNumber) => setCurrentPage(pageNumber)}
      >
        {number}
      </Pagination.Item>
    );
  }

  useEffect(() => {
    handleFetchRestaurantsByOwner(userId, token, setRestaurants);
    handleFetchRestaurantTypes(token, setRestaurantTypes);
  }, [userId, token]);

  useEffect(() => {
    window.addEventListener("popstate", () => setSelectedRestaurantId(null));
    return () => {window.removeEventListener("popstate", () => setSelectedRestaurantId(null));};
  }, [selectedRestaurantId]);

  return (
    <Container>
      <Tab.Container defaultActiveKey="my-restaurants">
        <Nav
          variant="underline"
          className="mb-3"
          onSelect={() => setSelectedRestaurantId(null)}
        >

          <Nav.Item>
            <Nav.Link eventKey="my-restaurants">My Restaurants</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="personnel">Personnel</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="orders-table">Orders</Nav.Link>
          </Nav.Item>

        </Nav>

        <Tab.Content>

          <Tab.Pane eventKey="my-restaurants">
            {selectedRestaurantId ? (
              <RestaurantPage restaurantId={selectedRestaurantId} />
            ) : (
              <RAdminRestaurantsTable
                restaurants={currentRestaurants}
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
                paginationItems={paginationItems}
                handlePageChange={(pageNumber) => setCurrentPage(pageNumber)}
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
              ) : (
                <>
                <Row>
                <Col>
                  <RAdminOrdersTable
                    orders={ordersOwner}
                    handleOrderSelectParent={(orderId) =>
                      handleShowOrderModal(orderId)
                    }
                    handleRestaurantSelectParent={(restaurantId) =>
                      setSelectedRestaurantId(restaurantId)
                    }
                    refreshOrdersParent={() =>
                      handleFetchOrdersOwner(token, userId, setOrdersOwner)}
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
                    <Button variant="secondary" onClick={handleCloseOrderModal}>
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>
              )}
                </>)}
            </Tab.Pane>

        </Tab.Content>
      </Tab.Container>
    </Container>
  );
};

export default RestaurantAdminPage;
