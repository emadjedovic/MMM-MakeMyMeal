// src/components/AddRestaurantForm.js
import React, { useState } from "react";
import axios from "axios";

const AddRestaurantForm = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    name: "",
    latitude: "",
    longitude: "",
    street_name: "",
    city: "",
    star_rating: "",
    type: "",
    radius_of_delivery_km: "",
    owner_id: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddRestaurant = async () => {
    try {
      const response = await axios.post("http://localhost:8000/api/restaurants/new", formData);
      alert("Restaurant added successfully!");
      onAdd(response.data);
    } catch (error) {
      console.error("There was an error adding the restaurant!", error);
    }
  };

  return (
    <div>
      <h3>Add a Restaurant</h3>
      <form>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Restaurant Name"
        />
        <input
          type="text"
          name="latitude"
          value={formData.latitude}
          onChange={handleInputChange}
          placeholder="Latitude"
        />
        <input
          type="text"
          name="longitude"
          value={formData.longitude}
          onChange={handleInputChange}
          placeholder="Longitude"
        />
        <input
          type="text"
          name="street_name"
          value={formData.street_name}
          onChange={handleInputChange}
          placeholder="Street Name"
        />
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleInputChange}
          placeholder="City"
        />
        <input
          type="number"
          name="star_rating"
          value={formData.star_rating}
          onChange={handleInputChange}
          placeholder="Star Rating"
        />
        <input
          type="text"
          name="type"
          value={formData.type}
          onChange={handleInputChange}
          placeholder="Restaurant Type"
        />
        <input
          type="number"
          name="radius_of_delivery_km"
          value={formData.radius_of_delivery_km}
          onChange={handleInputChange}
          placeholder="Radius of Delivery (km)"
        />
        <input
          type="number"
          name="owner_id"
          value={formData.owner_id}
          onChange={handleInputChange}
          placeholder="Owner ID"
        />
        <button type="button" onClick={handleAddRestaurant}>
          Add Restaurant
        </button>
      </form>
    </div>
  );
};

export default AddRestaurantForm;
