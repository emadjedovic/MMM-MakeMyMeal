// src/components/UpdateRestaurantForm.js
import React, { useContext, useState } from "react";
import axios from "axios";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { UserContext } from '../UserContext';

const UpdateRestaurantForm = ({ onUpdate }) => {
  const { token } = useContext(UserContext);
  const [updateId, setUpdateId] = useState(0);
  const [name, setName] = useState(""); // Changed to empty string
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [streetName, setStreetName] = useState("");
  const [city, setCity] = useState("");
  const [starRating, setStarRating] = useState(""); // Changed to empty string
  const [type, setType] = useState("");
  const [radiusOfDeliveryKm, setRadiusOfDeliveryKm] = useState("");
  const [isArchived, setIsArchived] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const requestData = {
    name: name || undefined, // Ensure not to send if empty
    latitude: latitude || undefined,
    longitude: longitude || undefined,
    street_name: streetName || undefined,
    city: city || undefined,
    star_rating: starRating || undefined,
    type: type || undefined,
    radius_of_delivery_km: radiusOfDeliveryKm || undefined,
    is_archived: isArchived // bool
  };

  const handleUpdateRestaurant = async () => {
    if (updateId < 0) {
      alert("Restaurant ID cannot be less than 0.");
      return;
    }
    try {
      const response = await axios.put(
        `http://localhost:8000/api/restaurants/update/${updateId}`,
        requestData, // Data to be sent (RestaurantUpdate)
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Restaurant updated successfully: ", response);
      onUpdate(response.data);
    } catch (error) {
      console.error("There was an error updating the restaurant (handleUpdateRestaurant)!", error);
    }
  };

  return (
    <Container className="my-4" style={{ maxWidth: '400px' }}>
      <Card>
        <Card.Body>
          <h3>UPDATE A RESTAURANT</h3>
          <Form>
            <Form.Group controlId="formUpdateId">
              <Form.Label>Restaurant ID</Form.Label>
              <Form.Control
                type="number"
                value={updateId}
                onChange={(e) => setUpdateId(Number(e.target.value))}
                placeholder="Enter restaurant ID"
                min="0"
              />
            </Form.Group>
            <Form.Group controlId="formName">
              <Form.Label>Restaurant Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
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
                    name="latitude"
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
                    name="longitude"
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
                name="street_name"
                value={streetName}
                onChange={(e) => setStreetName(e.target.value)}
                placeholder="Enter street name"
              />
            </Form.Group>
            <Form.Group controlId="formCity">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                name="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city"
              />
            </Form.Group>
            <Form.Group controlId="formStarRating">
              <Form.Label>Star Rating</Form.Label>
              <div className="d-flex">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Form.Check
                    inline
                    key={rating}
                    type="radio"
                    id={`star_rating_${rating}`}
                    name="star_rating"
                    value={starRating}
                    checked={starRating === rating}
                    onChange={(e) => setStarRating(Number(e.target.value))}
                    label={rating}
                  />
                ))}
              </div>
            </Form.Group>
            <Form.Group controlId="formType">
              <Form.Label>Restaurant Type</Form.Label>
              <Form.Control
                as="select"
                name="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="">Select a type</option>
                <option value="TRADITIONAL">Traditional</option>
                <option value="FAST FOOD">Fast Food</option>
                <option value="PIZZERIA">Pizzeria</option>
                <option value="CASUAL">Casual Dining</option>
                <option value="FINE DINING">Fine Dining</option>
                <option value="BAKERY">Bakery</option>
                <option value="CAFE">Cafe</option>
                <option value="PUB">Pub</option>
                <option value="OTHER">Other</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formRadiusOfDelivery">
              <Form.Label>Radius of Delivery (km)</Form.Label>
              <Form.Control
                type="range"
                name="radius_of_delivery_km"
                min="0"
                max="15"
                value={radiusOfDeliveryKm}
                onChange={(e) => setRadiusOfDeliveryKm(Number(e.target.value))}
              />
              <Form.Text className="text-muted">
                {radiusOfDeliveryKm} km
              </Form.Text>
            </Form.Group>
            <Form.Group controlId="formIsArchived">
              <Form.Check
                type="checkbox"
                name="is_archived"
                checked={isArchived}
                onChange={(e) => setIsArchived(e.target.checked)}
                label="Archived"
              />
            </Form.Group>
            <Button
              variant="primary"
              onClick={handleUpdateRestaurant}
              style={{ margin: '1rem' }}
            >
              Update Restaurant
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UpdateRestaurantForm;
