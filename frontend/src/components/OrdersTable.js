import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Container,
  Pagination,
  Row,
  Col
} from "react-bootstrap";
import { formatCreatedAt } from "../calculations";
import { handleFetchRestaurantNamesFromOrders } from "../handlers/RestaurantPageHandlers";

const OrdersTable = ({
  orders,
  handleOrderSelectParent,
  handleRestaurantSelectParent,
}) => {
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
    handleFetchRestaurantNamesFromOrders(orders, setRestaurantNames, restaurantNames);
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
              </tr>
            </thead>
            <tbody>
              {currentItems.map((order) => {
                return (
                  <tr key={order.id}>
                    <td><Button
                        variant="link"
                        onClick={() =>
                          handleOrderSelectParent(order.id)
                        }
                      >
                        #{order.id}
                      </Button></td>
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

export default OrdersTable;
