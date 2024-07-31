import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";
import { Container, Tab, Nav } from "react-bootstrap";
import "../css/App.css";
import CreatePersonnelForm from "../components/CreatePersonnelForm";
import RAdminRestaurantsTable from "../components/RAdminRestaurantsTable";

const RestaurantAdminHome = () => {
  
  const { token } = useContext(UserContext);

  const handlePersonnelCreated = (dp) => {
    console.log("New delivery personnel created:", dp);
  };

  return (
    <Container>
      <Tab.Container defaultActiveKey="home">
        <Nav variant="underline" className="mb-3">
          <Nav.Item>
            <Nav.Link eventKey="home">Home</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="manage-personnel">Manage Personnel</Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey="home">
            
      <RAdminRestaurantsTable/>
          </Tab.Pane>
          <Tab.Pane eventKey="manage-personnel">
            
      <CreatePersonnelForm onPersonnelCreated={handlePersonnelCreated} />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
};

export default RestaurantAdminHome;
