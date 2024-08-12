import React from "react";
import { Container, Tab, Nav } from "react-bootstrap";
import "../css/App.css";

const DeliveryPersonnelPage = () => {

  return (
    <Container>
      <Tab.Container defaultActiveKey="my-deliveries">

        <Nav variant="underline" className="mb-3">

          <Nav.Item>
            <Nav.Link eventKey="my-deliveries">My Deliveries</Nav.Link>
          </Nav.Item>

        </Nav>

        <Tab.Content>

          <Tab.Pane eventKey="my-deliveries"></Tab.Pane>
          
        </Tab.Content>

      </Tab.Container>
    </Container>
  );
};

export default DeliveryPersonnelPage;
