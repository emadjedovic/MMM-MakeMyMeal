import React from 'react';

const DeliveryPersonnelPage = ({ onLogout }) => {
  const handleLogout = () => {
    onLogout();
  };

  return (
    <div>
      <h2>Delivery Personnel Dashboard</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default DeliveryPersonnelPage;
