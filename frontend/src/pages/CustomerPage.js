import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { Container, Tab, Nav, Row, Col } from "react-bootstrap";
import "../css/App.css";

import CustomerRestaurantsTable from "../components/onlyCustomer/CustomerRestaurantsTable";
import RecommendedRestaurants from "../components/onlyCustomer/RecommendedRestaurants";
import PromotionsTable from "../components/PromotionsTable";
import RecommendedItems from "../components/onlyCustomer/RecommendedItems";
import Restaurant from "../components/Restaurant";

import {
  fetchRestaurantsByType,
  handleTypeSelect,
  fetchPromotionData,
  fetchRecommended,
  fetchTypes,
  handleRestaurantSelectParent,
  handlePopState,
} from "../handlers/customerHandlers";

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

  useEffect(() => {
    window.addEventListener("popstate", () =>
      handlePopState(setSelectedRestaurantId)
    );

    return () => {
      window.removeEventListener("popstate", () =>
        handlePopState(setSelectedRestaurantId)
      );
    };
  }, []);

  return (
    <Container>
      <Tab.Container defaultActiveKey="nearby-restaurants">
        <Nav
          variant="underline"
          className="mb-3"
          onClick={() => handlePopState(setSelectedRestaurantId)}
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
              <Restaurant restaurantId={selectedRestaurantId} />
            ) : (
              <>
                <CustomerRestaurantsTable
                  nearbyRestaurants={nearbyRestaurants}
                  restaurantTypes={restaurantTypes}
                  onTypeSelect={(type) =>
                    handleTypeSelect(type, setSelectedType)
                  }
                  selectedType={selectedType}
                  handleRestaurantSelectParent={(restaurantId) =>
                    handleRestaurantSelectParent(
                      restaurantId,
                      setSelectedRestaurantId
                    )
                  }
                />
                <Row>
                  <Col md={8} lg={8}>
                    <RecommendedItems
                      recommended={recommendedItems}
                      handleRestaurantSelectParent={(restaurantId) =>
                        handleRestaurantSelectParent(
                          restaurantId,
                          setSelectedRestaurantId
                        )
                      }
                    />
                  </Col>
                  <Col md={4} lg={4}>
                    <RecommendedRestaurants
                      recommended={recommendedRestaurants}
                      handleRestaurantSelectParent={(restaurantId) =>
                        handleRestaurantSelectParent(
                          restaurantId,
                          setSelectedRestaurantId
                        )
                      }
                    />
                  </Col>
                </Row>
              </>
            )}
          </Tab.Pane>

          <Tab.Pane eventKey="promotions-table">
            {selectedRestaurantId ? (
              <Restaurant restaurantId={selectedRestaurantId} />
            ) : (
              <>
                <PromotionsTable
                  items={promotedItems}
                  promotions={promotions}
                  handleRestaurantSelectParent={(restaurantId) =>
                    handleRestaurantSelectParent(
                      restaurantId,
                      setSelectedRestaurantId
                    )
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
