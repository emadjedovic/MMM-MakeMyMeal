import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { Container, Tab, Nav, Row, Col } from "react-bootstrap";
import "../css/App.css";
import CustomerRestaurantsTable from "../components/CustomerRestaurantsTable";
import RecommendedRestaurants from "../components/RecommendedRestaurants";
import PromotionsTable from "../components/PromotionsTable";
import RecommendedItems from "../components/RecommendedItems";
import {
  fetchRestaurantsByType,
  handleTypeSelect,
  fetchPromotionData,
  fetchRecommended,
  fetchTypes
} from "../services/customerHandlers";

const CustomerPage = () => {
  const { token } = useContext(UserContext);
  const [nearbyRestaurants, setNearbyRestaurants] = useState([]);
  const [restaurantTypes, setRestaurantTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("All");
  const [recommendedRestaurants, setRecommendedRestaurants] = useState([]);
  const [recommendedItems, setRecommendedItems] = useState([]);
  const [promotedItems, setPromotedItems] = useState([]);
  const [promotions, setPromotions] = useState([]);

  useEffect(() => {
    if (token) {
      fetchRestaurantsByType(token, selectedType, setNearbyRestaurants);
    }
  }, [selectedType, token]);

  useEffect(() => {
    if (token) {
      fetchRecommended(token, setRecommendedRestaurants, setRecommendedItems);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchTypes(token, setRestaurantTypes);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchPromotionData(token, setPromotedItems, setPromotions);
    }
  }, [token]);

  return (
    <Container>
      <Tab.Container defaultActiveKey="nearby-restaurants">
        <Nav variant="underline" className="mb-3">
          <Nav.Item>
            <Nav.Link eventKey="nearby-restaurants">Restaurants</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="promotions-table">Promotions</Nav.Link>
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
            <Row>
              <Col md={8} lg={8}>
                <RecommendedItems recommended={recommendedItems} />
              </Col>
              <Col md={4} lg={4}>
                <RecommendedRestaurants recommended={recommendedRestaurants} />
              </Col>
            </Row>
          </Tab.Pane>
          <Tab.Pane eventKey="promotions-table">
            <PromotionsTable items={promotedItems} promotions={promotions} />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
};

export default CustomerPage;
