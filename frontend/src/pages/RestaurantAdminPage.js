import React from 'react';

const RestaurantAdminPage = ({ onLogout }) => {
  const handleLogout = () => {
    onLogout();
  };

  return (
    <div>
      <h2>Restaurant Admin Dashboard</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default RestaurantAdminPage;
