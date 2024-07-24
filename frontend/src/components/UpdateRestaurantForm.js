// src/components/UpdateRestaurantForm.js
import React, { useState } from "react";
import axios from "axios";

const UpdateRestaurantForm = ({ onUpdate }) => {
  const [formData, setFormData] = useState({
    name: "",
    latitude: "",
    longitude: "",
    street_name: "",
    city: "",
    star_rating: "",
    type: "",
    radius_of_delivery_km: "",
    is_archived: false,
  });

  const [updateId, setUpdateId] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdateRestaurant = async () => {
    try {
      const response = await axios.put(`http://localhost:8000/api/restaurants/update/${updateId}`, formData);
      alert("Restaurant updated successfully!");
      onUpdate(response.data);
    } catch (error) {
      console.error("There was an error updating the restaurant!", error);
    }
  };

  return (
    <div>
      <h3>Update a Restaurant</h3>
      <input
        type="number"
        value={updateId}
        onChange={(e) => setUpdateId(e.target.value)}
        placeholder="Restaurant ID to Update"
      />
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
          type="checkbox"
          name="is_archived"
          checked={formData.is_archived}
          onChange={(e) => setFormData({ ...formData, is_archived: e.target.checked })}
        />
        <label>Archived</label>
        <button type="button" onClick={handleUpdateRestaurant}>
          Update Restaurant
        </button>
      </form>
    </div>
  );
};

export default UpdateRestaurantForm;
