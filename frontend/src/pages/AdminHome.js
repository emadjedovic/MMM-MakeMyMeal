import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from '../UserContext';
import AddRestaurantForm from "../components/AddRestaurantForm";
import UpdateRestaurantForm from "../components/UpdateRestaurantForm";
import AllRestaurantsTable from "../components/AllRestaurantsTable";
import "../css/App.css"

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
      console.log("restaurants: ", response.data)
      setRestaurants(response.data);
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

  const handleToggleArchive = (id) => {
    console.log("entered adminhome")
    setRestaurants(
      restaurants.map((restaurant) =>
        restaurant.id === id
          ? { ...restaurant, is_archived: !restaurant.is_archived }
          : restaurant
      )
    );
  };

  return (
    <div>
      <h1>ADMIN DASHBOARD</h1>
      <AllRestaurantsTable restaurants={restaurants} onToggleArchive={handleToggleArchive} />
      <AddRestaurantForm onAdd={handleAdd} />
      <UpdateRestaurantForm onUpdate={handleUpdate} />
    </div>
  );
};

export default AdminHome;
