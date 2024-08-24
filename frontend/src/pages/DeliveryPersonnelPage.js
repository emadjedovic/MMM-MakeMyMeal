import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { Container, Tab, Nav, Row, Col } from "react-bootstrap";
import DPOrdersTable from "../components/tables/DPOrdersTable";
import { handleFetchDeliveriesToday } from "../handlers/DeliveryPageHandlers";

const DeliveryPersonnelPage = () => {
  const { token, user } = useContext(UserContext);
  const userId = user.id;
  const [deliveriesToday, setDeliveriesToday] = useState([]);

  useEffect(() => {
    handleFetchDeliveriesToday(token, userId, setDeliveriesToday);
  }, [token, userId]);

  return (
    <Container>
      <Tab.Container defaultActiveKey="orders-table">
        <Nav variant="underline" className="mb-3">
          <Nav.Item>
            <Nav.Link eventKey="orders-table">Deliveries for Today</Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey="orders-table">
            <Row>
              <Col>
                <DPOrdersTable
                  orders={deliveriesToday}
                  handleOrderSelectParent={() => {}}
                  handleRestaurantSelectParent={() => {}}
                  refreshOrdersParent={() =>
                    handleFetchDeliveriesToday(
                      token,
                      userId,
                      setDeliveriesToday
                    )
                  }
                />
              </Col>
            </Row>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
};

export default DeliveryPersonnelPage;
