import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { Container, Tab, Nav, Row, Col } from "react-bootstrap";
import "../css/App.css";

import CustomerRestaurantsTable from "../components/customer/CustomerRestaurantsTable";
import RecommendedRestaurants from "../components/customer/RecommendedRestaurants";
import PromotionsTable from "../components/PromotionsTable";
import RecommendedItems from "../components/customer/RecommendedItems";
import RestaurantPage from "../components/RestaurantPage";

import {
  handleFetchPromotionData,
  handleFetchRecommended,
  handleFetchRestaurantTypes,
  handleFetchNearbyRestaurants,
} from "../handlers/CustomerPageHandlers";

const CustomerPage = () => {
  const { token } = useContext(UserContext);
  const [nearbyRestaurants, setNearbyRestaurants] = useState([]);
  const [restaurantTypes, setRestaurantTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("All");
  const [recommendedRestaurants, setRecommendedRestaurants] = useState([]);
  const [recommendedItems, setRecommendedItems] = useState([]);
  const [promotedItems, setPromotedItems] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);

  
  const [ordersCustomerHistory, setOrdersCustomerHistory] = useState([]);

  useEffect(() => {
    if (token) {
      handleFetchNearbyRestaurants(token, selectedType, setNearbyRestaurants);
    }
  }, [selectedType, token]);

  useEffect(() => {
    if (token) {
      handleFetchRecommended(
        token,
        setRecommendedRestaurants,
        setRecommendedItems
      );
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      handleFetchRestaurantTypes(token, setRestaurantTypes);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      handleFetchPromotionData(token, setPromotedItems, setPromotions);
    }
  }, [token]);

  useEffect(() => {
    window.addEventListener("popstate", () => 
      setSelectedRestaurantId(null)
    );

    return () => {
      window.removeEventListener("popstate", () => 
        setSelectedRestaurantId(null)
      );
    };
  }, []);

  return (
    <Container>
      <Tab.Container defaultActiveKey="nearby-restaurants">
        <Nav
          variant="underline"
          className="mb-3"
          onClick={() => 
            setSelectedRestaurantId(null)}
        >
          <Nav.Item>
            <Nav.Link eventKey="nearby-restaurants">Restaurants</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="promotions-table">Promotions</Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey="nearby-restaurants">
            {selectedRestaurantId ? (
              <RestaurantPage restaurantId={selectedRestaurantId} />
            ) : (
              <>
                <CustomerRestaurantsTable
                  nearbyRestaurants={nearbyRestaurants}
                  restaurantTypes={restaurantTypes}
                  onTypeSelect={(type) => setSelectedType(type)}
                  selectedType={selectedType}
                  handleRestaurantSelectParent={(
                    restaurantId
                  ) => 
                    setSelectedRestaurantId(restaurantId)
                  }
                />
                <Row>
                  <Col md={8} lg={8}>
                    <RecommendedItems
                      recommended={recommendedItems}
                      handleRestaurantSelectParent={(
                        restaurantId
                      ) => 
                        setSelectedRestaurantId(restaurantId)
                      }
                    />
                  </Col>
                  <Col md={4} lg={4}>
                    <RecommendedRestaurants
                      recommended={recommendedRestaurants}
                      handleRestaurantSelectParent={(
                        restaurantId
                      ) => 
                        setSelectedRestaurantId(restaurantId)
                      }
                    />
                  </Col>
                </Row>
              </>
            )}
          </Tab.Pane>

          <Tab.Pane eventKey="promotions-table">
            {selectedRestaurantId ? (
              <RestaurantPage restaurantId={selectedRestaurantId} />
            ) : (
              <>
                <PromotionsTable
                  items={promotedItems}
                  promotions={promotions}
                  handleRestaurantSelectParent={(
                    restaurantId
                  ) => 
                    setSelectedRestaurantId(restaurantId)
                  }
                />
              </>
            )}
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
};

export default CustomerPage;
