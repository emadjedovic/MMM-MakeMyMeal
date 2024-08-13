import React, { useState, useContext } from "react";
import { Container, Row, Col, Pagination, Form, Button } from "react-bootstrap";
import "../css/App.css";
import ItemCard from "./ItemCard.js";
import ItemTypesList from "./ItemTypesList.js";
import { UserContext } from "../UserContext.js";
import AddItemModal from "./restaurantadmin/AddItemModal.js";
import { placeOrder } from "../api/ordersApi.js";
import PlaceOrderModal from "./customer/PlaceOrderModal.js";

const ItemsTable = ({
  items,
  foodTypes,
  onFoodTypeSelect,
  selectedFoodType,
  restaurantId,
  refreshItems,
}) => {
  const itemsPerPage = 4;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnPromotion, setShowOnPromotion] = useState(false);
  const { userRole, token, user } = useContext(UserContext);
  const [showModal, setShowModal] = useState(false); // for restaurant admins adding items

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const filteredItems = items.filter((item) => {
    const matchesName = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesOnPromotion = showOnPromotion ? item.is_promoted : true;
    return matchesName && matchesOnPromotion;
  });

  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // new for orders

  const [orderItems, setOrderItems] = useState([]);
  const [showPlaceOrderModal, setShowPlaceOrderModal] = useState(false); // for customers

  const addItemToOrder = (itemId, quantity) => {
    setOrderItems((prevItems) => [...prevItems, { itemId, quantity }]);
    console.log(`Item with ID ${itemId} added to order in quantity ${quantity}.`)
  };

  const handlePlaceOrder = async (orderData) => {
    try {
      await placeOrder(token, user.id, {
        ...orderData,
        restaurant_id: restaurantId,
      });
      console.log("Order placed successfully.");
    } catch (error) {
      console.error("Error in handlePlaceOrder (ItemsTable.js).");
    }
  };

  return (
    <Container className="my-4">
      <Row>
        <Col md={4} lg={3} xl={3} xxl={3}>
          <ItemTypesList
            foodTypes={foodTypes}
            selectedFoodType={selectedFoodType}
            handleFoodTypeSelect={onFoodTypeSelect}
          />

          <Button
            variant="success"
            onClick={() => setShowPlaceOrderModal(true)}
          >
            Review Order
          </Button>
          <PlaceOrderModal
            show={showPlaceOrderModal}
            handleClose={() => setShowPlaceOrderModal(false)}
            handlePlaceOrder={handlePlaceOrder}
            orderItems={orderItems}
          />
        </Col>
        <Col md={8} lg={9} xl={9} xxl={9}>
          <Row>
            <Col md={12} lg={6}>
              <Form.Control
                type="text"
                placeholder="Search by item name"
                value={searchQuery}
                onChange={handleSearchChange}
                className="mb-3"
              />
            </Col>
            <Col>
              <Form.Check
                type="checkbox"
                label="On Discount"
                checked={showOnPromotion}
                onChange={() => setShowOnPromotion(!showOnPromotion)}
              />
            </Col>
            {userRole === "RESTAURANT ADMIN" && (
              <Col>
                <Button
                  variant="outline-dark"
                  size="sm"
                  onClick={() => setShowModal(true)}
                >
                  Add Item
                </Button>
              </Col>
            )}
          </Row>
          <Row className="mt-3">
            {currentItems.map((item) => (
              <Col md={12} lg={12} xxl={12} key={item.id} className="mb-3">
                <ItemCard
                  item={item}
                  isInRestaurant={true}
                  refreshItems={refreshItems}
                  addItemToOrder={addItemToOrder}
                />
              </Col>
            ))}
          </Row>
          <Pagination>{paginationItems}</Pagination>
        </Col>
      </Row>
      <AddItemModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        foodTypes={foodTypes}
        token={token}
        restaurantId={restaurantId}
        refreshItems={refreshItems}
      />
    </Container>
  );
};

export default ItemsTable;
