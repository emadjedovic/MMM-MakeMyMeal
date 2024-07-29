import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from '../UserContext';
import AddRestaurantForm from "../components/AddRestaurantForm";
import UpdateRestaurantForm from "../components/UpdateRestaurantForm";
import AllRestaurantsTable from "../components/AllRestaurantsTable";

const AdminHome = () => {
  const { token } = useContext(UserContext);
  const [restaurants, setRestaurants] = useState([]);

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/restaurants/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRestaurants(response.data.items);
    } catch (error) {
      console.error('There was an error fetching the restaurants!', error);
    }
  };


  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleAdd = (newRestaurant) => {
    setRestaurants([...restaurants, newRestaurant]);
  };

  const handleUpdate = (updatedRestaurant) => {
    setRestaurants(
      restaurants.map((restaurant) =>
        restaurant.id === updatedRestaurant.id ? updatedRestaurant : restaurant
      )
    );
  };

  const handleArchive = (id) => {
    setRestaurants(
      restaurants.map((restaurant) =>
        restaurant.id === id
          ? { ...restaurant, isArchived: true }
          : restaurant
      )
    );
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <AddRestaurantForm onAdd={handleAdd} />
      <UpdateRestaurantForm onUpdate={handleUpdate} />
      <h1>All Restaurants</h1>
      <AllRestaurantsTable restaurants={restaurants} onArchive={handleArchive} />
    </div>
  );
};

export default AdminHome;
