import React from 'react';

const CustomerPage = ({ onLogout }) => {

    const handleLogout = () => {
        onLogout();
    };

    return (
        <div>
            <h2>Customer Dashboard</h2>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default CustomerPage;
