import React, { useState } from "react";
import {
  Table,
  Button,
  Container,
  Pagination,
  Row,
  Col,
  Form,
} from "react-bootstrap";
import RestaurantPage from "../pages/RestaurantPage";

const PromotionsTable = ({ items, promotions }) => {
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchName, setSearchName] = useState("");
  const [searchFoodType, setFoodType] = useState("");
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Filter items based on search queries
  const filteredItems = items.filter((item) => {
    const matchesName = item.name
      .toLowerCase()
      .includes(searchName.toLowerCase());
    const matchesType = item.food_type_name
      .toLowerCase()
      .includes(searchFoodType.toLowerCase());

    return matchesName && matchesType;
  });

  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemSelect = (restaurantId) => {
    setSelectedRestaurantId(restaurantId);
  };

  const handleSearchNameChange = (e) => {
    setSearchName(e.target.value);
    setCurrentPage(1); // Reset to the first page when search query changes
  };

  const handleFoodTypeChange = (e) => {
    setFoodType(e.target.value);
    setCurrentPage(1); // Reset to the first page when search query changes
  };

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginationItems = [];
  for (let number = 1; number <= totalPages; number++) {
    paginationItems.push(
      <Pagination.Item
        key={number}
        active={number === currentPage}
        onClick={() => handlePageChange(number)}
      >
        {number}
      </Pagination.Item>
    );
  }

  // Function to calculate original price
  const originalPrice = (priceOnDiscount, discount) => {
    const original = priceOnDiscount / (1 - discount);
    return Math.round(original * 100) / 100;
  };

  // Function to format discount percentage as an integer
  const formatDiscount = (discount) => {
    if (discount !== null) {
      return `${Math.round(discount * 100)}%`; // Round to nearest integer
    }
    return "N/A";
  };

  return (
    <Container className="my-4">
      {selectedRestaurantId ? (
        <RestaurantPage restaurantId={selectedRestaurantId} />
      ) : (
        <>
          <Row>
            <Col md={9} lg={9} xl={10}>
              <Row className="mb-3">
                <Col md={6} lg={5}>
                  <Form.Control
                    type="text"
                    placeholder="Search by item name"
                    value={searchName}
                    onChange={handleSearchNameChange}
                  />
                </Col>
                <Col md={6} lg={7}>
                  <Form.Control
                    type="text"
                    placeholder="Search by type"
                    value={searchFoodType}
                    onChange={handleFoodTypeChange}
                  />
                </Col>
              </Row>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Original</th>
                    <th>Discount</th>
                    <th>Type</th>
                    <th>Image</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((item) => {
                    const promotion = promotions.find(
                      (promo) => promo.item_id === item.id
                    );
                    const discount = promotion
                      ? promotion.discount_fraction
                      : null;
                    const original = promotion
                      ? originalPrice(item.price, discount)
                      : item.price;
                    return (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>
                          <Button
                            variant="link"
                            onClick={() => handleItemSelect(item.restaurant_id)}
                          >
                            {item.name}
                          </Button>
                        </td>
                        <td>{item.price}</td>
                        <td>{original}</td>
                        <td>{formatDiscount(discount)}</td>{" "}
                        {/* Use formatted discount */}
                        <td>{item.food_type_name}</td>
                        <td>
                          <img
                            src={`http://localhost:8000/assets/${item.imageUrl}`}
                            alt={item.name}
                            width="100px"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
              <Pagination>{paginationItems}</Pagination>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default PromotionsTable;
