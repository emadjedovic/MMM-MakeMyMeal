import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { Container, Tab, Nav } from "react-bootstrap";
import "../css/App.css";
import {
  fetchNearbyRestaurants,
  fetchRestaurantTypes
} from "../services/api";
import CustomerRestaurantsTable from "../components/CustomerRestaurantsTable";

const CustomerHome = () => {
  const { token } = useContext(UserContext);
  const [nearbyRestaurants, setNearbyRestaurants] = useState([]);
  const [restaurantTypes, setRestaurantTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Sending selectedType: ", selectedType)
        console.log("Sending token: ", token)
        const fetchedNearbyRestaurants = await fetchNearbyRestaurants(selectedType, token);
        console.log("Continue to setting")
        setNearbyRestaurants(fetchedNearbyRestaurants);
      } catch (error) {
        console.error("Error fetching nearby restaurants:", error);
      }
    };

    fetchData();
  }, [selectedType, token]);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const types = await fetchRestaurantTypes(token);
        setRestaurantTypes(types);
      } catch (error) {
        console.error("Error fetching restaurant types:", error);
      }
    };

    fetchTypes();
  }, [token]);

  const handleTypeSelect = (type) => {
    setSelectedType(type);
  };
  

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
              onTypeSelect={handleTypeSelect}
              selectedType={selectedType}
            />
          </Tab.Pane>

        </Tab.Content>

      </Tab.Container>
    </Container>
  );
};

export default CustomerHome;
