import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";
import "../css/App.css";
import CreatePersonnelForm from "../components/CreatePersonnelForm";
import RAdminRestaurantsTable from "../components/RAdminRestaurantsTable";

const RestaurantAdminHome = () => {
  
  const { token } = useContext(UserContext);

  const handlePersonnelCreated = (dp) => {
    console.log("New delivery personnel created:", dp);
  };

  return (
    <div>
      <h2>Restaurant Admin Dashboard</h2>
      <RAdminRestaurantsTable/>
      <CreatePersonnelForm onPersonnelCreated={handlePersonnelCreated} />
    </div>
  );
};

export default RestaurantAdminHome;
