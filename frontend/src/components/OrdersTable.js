import React, { useState } from "react";
import {
  Table,
  Button,
  Container,
  Pagination,
  Row,
  Col
} from "react-bootstrap";

const OrdersTable = ({
  orders,
  handleOrderSelectParent,
  handleRestaurantSelectParent,
}) => {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

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

  return (
    <Container className="my-4">
      <Row>
        <Col md={9} lg={9} xl={10}>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Restaurant ID</th>
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
                        {order.restaurant_id}
                      </Button>
                    </td>
                    <td>{order.status.value}</td>
                    <td>{order.payment_method.value}</td>
                    <td>{order.total_price}</td>
                    <td>{order.created_at}</td>
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
