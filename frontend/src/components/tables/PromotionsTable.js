import React, { useState } from "react";
import { originalPrice, formatDiscount } from "../../calculations";
import {
  Table,
  Container,
  Pagination,
  Row,
  Col,
  Form,
  Button,
} from "react-bootstrap";

const PromotionsTable = ({
  items,
  promotions,
  handleRestaurantSelectParent,
}) => {
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchName, setSearchName] = useState("");
  const [searchFoodType, setFoodType] = useState("");

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

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

  const handleSearchNameChange = (e) => {
    setSearchName(e.target.value);
    setCurrentPage(1);
  };

  const handleFoodTypeChange = (e) => {
    setFoodType(e.target.value);
    setCurrentPage(1);
  };

  return (
    <Container className="my-4">
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
                const discount = promotion ? promotion.discount_fraction : null;
                const original = promotion
                  ? originalPrice(item.price, discount)
                  : item.price;
                return (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>
                      <Button
                        variant="link"
                        onClick={() =>
                          handleRestaurantSelectParent(item.restaurant_id)
                        }
                      >
                        {item.name}
                      </Button>
                    </td>
                    <td>{item.price}</td>
                    <td>{original}</td>
                    <td>{formatDiscount(discount)}</td>{" "}
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
    </Container>
  );
};

export default PromotionsTable;
