import React, { useEffect, useState } from "react";
import axios from "axios";
import AddRestaurantForm from "../components/AddRestaurantForm";
import UpdateRestaurantForm from "../components/UpdateRestaurantForm";
import ArchiveRestaurantList from "../components/ArchiveRestaurantList";

const AdminPage = () => {

  const [restaurants, setRestaurants] = useState([]);

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/restaurants/all");
      setRestaurants(response.data.items);
    } catch (error) {
      console.error("There was an error fetching the restaurants!", error);
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

  const handleRemove = (id) => {
    setRestaurants(restaurants.filter((restaurant) => restaurant.id !== id));
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <AddRestaurantForm onAdd={handleAdd} />
      <UpdateRestaurantForm onUpdate={handleUpdate} />
      <ArchiveRestaurantList restaurants={restaurants} onRemove={handleRemove} />
      <p>
        Luckily for Alice, the little magic bottle had now had its full effect,
        and she grew no larger: still it was very uncomfortable, and, as there
        seemed to be no sort of chance of her ever getting out of the room
        again, no wonder she felt unhappy. 'It was much pleasanter at home,'
        thought poor Alice, 'when one wasn't always growing larger and smaller,
        and being ordered about by mice and rabbits. I almost wish I hadn't gone
        down that rabbit-hole — and yet — and yet — it's rather curious, you
        know, this sort of life!
        Luckily for Alice, the little magic bottle had now had its full effect,
        and she grew no larger: still it was very uncomfortable, and, as there
        seemed to be no sort of chance of her ever getting out of the room
        again, no wonder she felt unhappy. 'It was much pleasanter at home,'
        thought poor Alice, 'when one wasn't always growing larger and smaller,
        and being ordered about by mice and rabbits. I almost wish I hadn't gone
        down that rabbit-hole — and yet — and yet — it's rather curious, you
        know, this sort of life!
        Luckily for Alice, the little magic bottle had now had its full effect,
        and she grew no larger: still it was very uncomfortable, and, as there
        seemed to be no sort of chance of her ever getting out of the room
        again, no wonder she felt unhappy. 'It was much pleasanter at home,'
        thought poor Alice, 'when one wasn't always growing larger and smaller,
        and being ordered about by mice and rabbits. I almost wish I hadn't gone
        down that rabbit-hole — and yet — and yet — it's rather curious, you
        know, this sort of life!
        Luckily for Alice, the little magic bottle had now had its full effect,
        and she grew no larger: still it was very uncomfortable, and, as there
        seemed to be no sort of chance of her ever getting out of the room
        again, no wonder she felt unhappy. 'It was much pleasanter at home,'
        thought poor Alice, 'when one wasn't always growing larger and smaller,
        and being ordered about by mice and rabbits. I almost wish I hadn't gone
        down that rabbit-hole — and yet — and yet — it's rather curious, you
        know, this sort of life!
        Luckily for Alice, the little magic bottle had now had its full effect,
        and she grew no larger: still it was very uncomfortable, and, as there
        seemed to be no sort of chance of her ever getting out of the room
        again, no wonder she felt unhappy. 'It was much pleasanter at home,'
        thought poor Alice, 'when one wasn't always growing larger and smaller,
        and being ordered about by mice and rabbits. I almost wish I hadn't gone
        down that rabbit-hole — and yet — and yet — it's rather curious, you
        know, this sort of life!
        Luckily for Alice, the little magic bottle had now had its full effect,
        and she grew no larger: still it was very uncomfortable, and, as there
        seemed to be no sort of chance of her ever getting out of the room
        again, no wonder she felt unhappy. 'It was much pleasanter at home,'
        thought poor Alice, 'when one wasn't always growing larger and smaller,
        and being ordered about by mice and rabbits. I almost wish I hadn't gone
        down that rabbit-hole — and yet — and yet — it's rather curious, you
        know, this sort of life!
        Luckily for Alice, the little magic bottle had now had its full effect,
        and she grew no larger: still it was very uncomfortable, and, as there
        seemed to be no sort of chance of her ever getting out of the room
        again, no wonder she felt unhappy. 'It was much pleasanter at home,'
        thought poor Alice, 'when one wasn't always growing larger and smaller,
        and being ordered about by mice and rabbits. I almost wish I hadn't gone
        down that rabbit-hole — and yet — and yet — it's rather curious, you
        know, this sort of life!
      </p>
    </div>
  );
};

export default AdminPage;
