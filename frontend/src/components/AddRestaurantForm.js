// src/components/AddRestaurantForm.js
import React, { useContext, useState } from "react";
import axios from "axios";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { UserContext } from '../UserContext';

const AddRestaurantForm = ({ onAdd }) => {
  const { token } = useContext(UserContext);
  const [formData, setFormData] = useState({
    name: null,
    latitude: null,
    longitude: null,
    street_name: null,
    city: null,
    star_rating: null,
    type: null,
    radius_of_delivery_km: null,
    owner_id: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "owner_id" && value < 0) return;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddRestaurant = async () => {
    console.log("Token:", token);  // Debug token value
    console.log("FormData: ", formData)
    try {
      const response = await axios.post(
        "http://localhost:8000/api/restaurants/new",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      console.log("Restaurant added successfully: ", response);
      onAdd(response.data);
    } catch (error) {
      console.error("There was an error adding the restaurant!", error);
    }
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
                name="name"
                value={formData.name}
                onChange={handleInputChange}
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
                    value={formData.latitude}
                    onChange={handleInputChange}
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
                    value={formData.longitude}
                    onChange={handleInputChange}
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
                value={formData.street_name}
                onChange={handleInputChange}
                placeholder="Enter street name"
              />
            </Form.Group>
            <Form.Group controlId="formCity">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
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
                    value={rating}
                    checked={formData.star_rating === rating.toString()}
                    onChange={handleInputChange}
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
                value={formData.type}
                onChange={handleInputChange}
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
                value={formData.radius_of_delivery_km}
                onChange={handleInputChange}
              />
              <Form.Text className="text-muted">
                {formData.radius_of_delivery_km} km
              </Form.Text>
            </Form.Group>
            <Form.Group controlId="formOwnerId">
              <Form.Label>Owner ID</Form.Label>
              <Form.Control
                type="number"
                name="owner_id"
                value={formData.owner_id}
                onChange={handleInputChange}
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
