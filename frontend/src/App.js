// src/App.js
import React, { useContext, useEffect } from 'react';
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { UserContext } from './UserContext';
import Sidebar from './components/Sidebar';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminHome from './pages/AdminHome';
import RestaurantAdminHome from './pages/RestaurantAdminHome';
import CustomerHome from './pages/CustomerHome';
import DeliveryPersonnelHome from './pages/DeliveryPersonnelHome';

import './css/App.css'; // Import the consolidated CSS file

function App() {
  const { token, user, userRole } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect to home if user is logged in and trying to access /login
  useEffect(() => {
    if (user && location.pathname === '/login') {
      navigate('/home');
    }
  }, [user, location.pathname, navigate]);

  const ProtectedRoute = ({ element }) => {
    return user ? element : <Navigate to="/login" />;
  };

  const renderComponentByRole = () => {
    switch (userRole) {
      case 'ADMIN':
        return <AdminHome />;
      case 'RESTAURANT ADMIN':
        return <RestaurantAdminHome />;
      case 'CUSTOMER':
        return <CustomerHome />;
      case 'DELIVERY PERSONNEL':
        return <DeliveryPersonnelHome />;
      default:
        return <Login />;
    }
  };

  // Custom component to handle unknown routes by redirecting to the previous Home
  const RedirectToPreviousHome = () => {
    const navigate = useNavigate();
    useEffect(() => {
      navigate(-1); // Go back to the previous Home
    }, [navigate]);

    return null;
  };

  return (
    <div className="App">
      {user && <Sidebar />}
      <div className="App-content">
        <Routes>
          <Route path="/" element={<Navigate to={token ? '/home' : '/login'} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
          <Route path="/home" element={<ProtectedRoute element={renderComponentByRole()} />} />
          {/* Handle all unknown routes by redirecting to the previous Home */}
          <Route path="*" element={<RedirectToPreviousHome />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
