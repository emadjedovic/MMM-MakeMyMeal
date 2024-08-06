import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { Container, Tab, Nav } from "react-bootstrap";
import "../css/App.css";
import CustomerRestaurantsTable from "../components/CustomerRestaurantsTable";
import RecommendedRestaurants from "../components/RecommendedRestaurants";
import {
  fetchRestaurantsByType,
  fetchOtherData,
  handleTypeSelect
} from "../services/customerHandlers";

const CustomerPage = () => {
  const { token } = useContext(UserContext);
  const [nearbyRestaurants, setNearbyRestaurants] = useState([]);
  const [restaurantTypes, setRestaurantTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("All");
  const [recommendedRestaurants, setRecommendedRestaurants] = useState([]);

  useEffect(() => {
    if (token) {
      fetchRestaurantsByType(token, selectedType, setNearbyRestaurants);
    }
  }, [selectedType, token]);

  useEffect(() => {
    if (token) {
      fetchOtherData(token, setRestaurantTypes, setRecommendedRestaurants);
    }
  }, [token]);


  return (
    <Container>
      <Tab.Container defaultActiveKey="nearby-restaurants">
        <Nav variant="underline" className="mb-3">
          <Nav.Item>
            <Nav.Link eventKey="nearby-restaurants">Restaurants</Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey="nearby-restaurants">
            <CustomerRestaurantsTable
              nearbyRestaurants={nearbyRestaurants}
              restaurantTypes={restaurantTypes}
              onTypeSelect={(type) => handleTypeSelect(type, setSelectedType)}
              selectedType={selectedType}
            />
            <RecommendedRestaurants recommended={recommendedRestaurants} />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
};

export default CustomerPage;
