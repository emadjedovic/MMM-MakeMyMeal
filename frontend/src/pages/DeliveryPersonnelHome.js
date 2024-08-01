import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { Container, Tab, Nav } from "react-bootstrap";
import "../css/App.css";

const DeliveryPersonnelHome = () => {
  
  const { token } = useContext(UserContext);

  return (
    <Container>
      <Tab.Container defaultActiveKey="home">
        <Nav variant="underline" className="mb-3">
          <Nav.Item>
            <Nav.Link eventKey="home">Home</Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey="home">
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
};

export default DeliveryPersonnelHome;
