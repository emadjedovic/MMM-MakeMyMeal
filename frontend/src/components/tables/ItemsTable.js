import React, { useState, useContext } from "react";
import { Container, Row, Col, Pagination, Form, Button } from "react-bootstrap";
import ItemCard from "../ItemCard.js";
import ItemTypesList from "../ItemTypesList.js";
import { UserContext } from "../../contexts/UserContext.js";
import AddItemModal from "../modals/AddItemModal.js";
import { placeOrder } from "../../api/ordersApi.js";
import PlaceOrderModal from "../modals/PlaceOrderModal.js";
import { createNotification } from "../../api/notificationsApi.js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NotificationsContext } from "../../contexts/NotificationsContext.js";

const ItemsTable = ({
  items,
  foodTypes,
  onFoodTypeSelect,
  selectedFoodType,
  restaurantId,
  refreshItems,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnPromotion, setShowOnPromotion] = useState(false);
  const { userRole, token, user } = useContext(UserContext);
  const [showModal, setShowModal] = useState(false);

  const { setNewNotification } = useContext(NotificationsContext);

  const itemsPerPage = 4;
  const [currentPage, setCurrentPage] = useState(1);

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
        onClick={() => setCurrentPage(number)}
      >
        {number}
      </Pagination.Item>
    );
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const [orderItems, setOrderItems] = useState([]);
  const [showPlaceOrderModal, setShowPlaceOrderModal] = useState(false);

  const addItemToOrder = (itemId, itemName, itemPrice, quantity) => {
    setOrderItems((prevItems) => [
      ...prevItems,
      { itemId, itemName, itemPrice, quantity },
    ]);
    console.log(
      `Item ${itemName} with ID ${itemId} of price ${itemPrice} added to order in quantity ${quantity}.`
    );
  };

  const removeItemFromOrder = (itemId) => {
    setOrderItems((prevItems) =>
      prevItems.filter((item) => item.itemId !== itemId)
    );
    console.log(`Item with ID ${itemId} removed from order.`);
  };

  const handlePlaceOrder = async (orderData) => {
    try {
      const orderResponse = await placeOrder(token, user.id, {
        ...orderData,
        restaurant_id: restaurantId,
      });

      console.log("Order placed successfully.");
      const notificationData = {
        user_id: user.id,
        restaurant_id: restaurantId,
        order_id: orderResponse.id,
        type: "NEW_ORDER",
        message: `A new order has been placed.\nTotal price: €${orderData.total_price.toFixed(
          2
        )}`,
      };

      await createNotification(token, notificationData);
      setNewNotification(true);
      toast.success("Order placed successfully!");
    } catch (error) {
      console.error("Error in handlePlaceOrder (ItemsTable.js).");
      toast.error("Failed to place order.");
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
          {userRole === "CUSTOMER" && (
            <>
              <Button
                variant="danger"
                onClick={() => setShowPlaceOrderModal(true)}
                className="mt-4"
                style={{
                  borderColor: "#ae4d2f",
                  fontSize: "1.5rem",
                  padding: "0.5rem 1.5rem",
                  borderRadius: "10rem",
                  color: "#ffffff",
                }}
              >
                ORDER
              </Button>

              <div className="m-3" style={{ fontSize: "4rem" }}>
                &#x1F6D2;
              </div>
              <PlaceOrderModal
                show={showPlaceOrderModal}
                handleClose={() => setShowPlaceOrderModal(false)}
                handlePlaceOrder={handlePlaceOrder}
                orderItems={orderItems}
              />
            </>
          )}
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
          <Row className="m-0 mt-3">
            {currentItems.map((item) => (
              <Col
                md={12}
                lg={12}
                xxl={12}
                key={item.id}
                className="m-0 mb-3"
                style={{ height: "100%" }}
              >
                <ItemCard
                  item={item}
                  isInRestaurant={true}
                  refreshItems={refreshItems}
                  addItemToOrder={addItemToOrder}
                  removeItemFromOrder={removeItemFromOrder}
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
