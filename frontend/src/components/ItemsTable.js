import React, { useState } from "react";
import { Container, Row, Col, Pagination, Form } from "react-bootstrap";
import "../css/App.css";
import ItemCard from "./ItemCard.js";
import ItemTypesList from "./ItemTypesList.js";

const ItemsTable = ({
  items,
  foodTypes,
  onFoodTypeSelect,
  selectedFoodType,
}) => {

  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Filter items by name based on the search query
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentItems = filteredItems.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
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

  return (
    <Container className="my-4">
      <Row>
        <Col md={4} lg={3} xl={3} xxl={3}>
          <ItemTypesList
            foodTypes={foodTypes}
            selectedFoodType={selectedFoodType}
            handleFoodTypeSelect={onFoodTypeSelect}
          />
        </Col>
        <Col md={8} lg={9} xl={9} xxl={9}>
          <Form.Control
            type="text"
            placeholder="Search by item name"
            value={searchQuery}
            onChange={handleSearchChange}
            className="mb-3"
          />
          <Row>
            {currentItems.map((item) => (
              <Col md={12} xxl={6} key={item.id} className="mb-3">
                <ItemCard item={item}/>
              </Col>
            ))}
          </Row>
          <Pagination>{paginationItems}</Pagination>
        </Col>
      </Row>
    </Container>
  );
};

export default ItemsTable;
