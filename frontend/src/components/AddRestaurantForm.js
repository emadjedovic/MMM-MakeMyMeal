// src/components/AddRestaurantForm.js
import React, { useContext, useState } from "react";
import { createRestaurant } from "../services/api";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { UserContext } from '../UserContext';

const AddRestaurantForm = ({ onAdd }) => {
  const { token } = useContext(UserContext);
  const [name, setName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [streetName, setStreetName] = useState("");
  const [city, setCity] = useState("");
  const [starRating, setStarRating] = useState(0); // Use 0 for optional
  const [type, setType] = useState("OTHER"); // Default value handled on server
  const [radiusOfDeliveryKm, setRadiusOfDeliveryKm] = useState(0); // Default value handled on server
  const [ownerId, setOwnerId] = useState("");

  const requestData = {
    name: name,
    latitude: latitude,
    longitude: longitude,
    street_name: streetName,
    city: city,
    star_rating: starRating || 0,
    type: type,
    radius_of_delivery_km: radiusOfDeliveryKm || 0,
    owner_id: ownerId
  };

  const handleAddRestaurant = async () => {
    try {
      const data = await createRestaurant(requestData, token);
      console.log("Restaurant added successfully: ", data);
      onAdd(data);
    } catch (error) {
      console.error("Error adding the restaurant!", error);
    }
  };

  const handleClearStarRating = () => {
    setStarRating(0); // Clear the selected star rating
  };

  return (
    <Container className="my-4" style={{ maxWidth: '400px' }}>
      <Card>
        <Card.Body>
          <h3>ADD A RESTAURANT</h3>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Restaurant Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter restaurant name"
              />
            </Form.Group>
            <Row>
              <Col>
                <Form.Group controlId="formLatitude">
                  <Form.Label>Latitude</Form.Label>
                  <Form.Control
                    type="number"
                    value={latitude}
                    onChange={(e) => setLatitude(Number(e.target.value))}
                    placeholder="Enter latitude"
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formLongitude">
                  <Form.Label>Longitude</Form.Label>
                  <Form.Control
                    type="number"
                    value={longitude}
                    onChange={(e) => setLongitude(Number(e.target.value))}
                    placeholder="Enter longitude"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group controlId="formStreetName">
              <Form.Label>Street Name</Form.Label>
              <Form.Control
                type="text"
                value={streetName}
                onChange={(e) => setStreetName(e.target.value)}
                placeholder="Enter street name"
              />
            </Form.Group>
            <Form.Group controlId="formCity">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city"
              />
            </Form.Group>
            <Form.Group controlId="formStarRating">
              <Form.Label>Star Rating (optional)</Form.Label>
              <div className="d-flex">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Form.Check
                    inline
                    key={rating}
                    type="radio"
                    id={`star_rating_${rating}`}
                    value={rating}
                    checked={starRating === rating}
                    onChange={(e) => setStarRating(Number(e.target.value))}
                    label={rating}
                  />
                ))}
              </div>
            </Form.Group>
            <Button
                variant="secondary"
                onClick={handleClearStarRating}
                style={{ margin: '1rem' }}
              >
                Clear Selection
              </Button>
            <Form.Group controlId="formType">
              <Form.Label>Restaurant Type</Form.Label>
              <Form.Control
                as="select"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="OTHER">Other</option>
                <option value="TRADITIONAL">Traditional</option>
                <option value="FAST FOOD">Fast Food</option>
                <option value="PIZZERIA">Pizzeria</option>
                <option value="CASUAL">Casual Dining</option>
                <option value="FINE DINING">Fine Dining</option>
                <option value="BAKERY">Bakery</option>
                <option value="CAFE">Cafe</option>
                <option value="PUB">Pub</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formRadiusOfDelivery">
              <Form.Label>Radius of Delivery in km</Form.Label>
              <Form.Control
                type="range"
                min="0"
                max="15"
                value={radiusOfDeliveryKm}
                onChange={(e) => setRadiusOfDeliveryKm(Number(e.target.value))}
              />
              <Form.Text className="text-muted">
                {radiusOfDeliveryKm} km
              </Form.Text>
            </Form.Group>
            <Form.Group controlId="formOwnerId">
              <Form.Label>Owner ID</Form.Label>
              <Form.Control
                type="number"
                value={ownerId}
                onChange={(e) => setOwnerId(Number(e.target.value))}
                placeholder="Enter owner ID"
                min="0"
              />
            </Form.Group>
            <Button
              variant="primary"
              onClick={handleAddRestaurant}
              style={{ margin: '1rem' }}
            >
              Add Restaurant
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AddRestaurantForm;