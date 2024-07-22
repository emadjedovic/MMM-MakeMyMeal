import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import axios from "axios";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminPage from "./pages/AdminPage";
import RestaurantAdminPage from "./pages/RestaurantAdminPage";
import CustomerPage from "./pages/CustomerPage";
import DeliveryPersonnelPage from "./pages/DeliveryPersonnelPage";

function App() {
  const [token, setToken] = useState(localStorage.getItem("access_token"));
  const [userRole, setUserRole] = useState(null);
  const [user, setUser] = useState(null);
  const location = useLocation();

  
  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const response = await axios.get("http://localhost:8000/api/users/me", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
          });
  
          setUser(response.data);
          setUserRole(response.data.role); // Ensure role is set correctly
        } catch (error) {
          console.error("Failed to fetch user data", error);
          setToken(null);
          setUser(null);
          setUserRole(null);
          localStorage.removeItem("access_token");
        }
      }
    };
  
    fetchUser();
  }, [token]);

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    setUserRole(null);
    localStorage.removeItem("access_token");
  };
  
  // If user is not authenticated, show the login page
  if (!user && location.pathname !== "/login") {
    return (
      <>
        <LoginPage />
        <Footer />
      </>
    );
  }

  const ProtectedRoute = ({ element }) => {
    return user ? element : <Navigate to="/login" />;
  };

  const RedirectToRole = () => {
    if (!user) {
      return <Navigate to="/login" />;
    }
    switch (userRole) {
      case "admin":
        return <Navigate to="/admin" />;
      case "restaurant_admin":
        return <Navigate to="/restaurant-admin" />;
      case "customer":
        return <Navigate to="/customer" />;
      case "delivery_personnel":
        return <Navigate to="/delivery-personnel" />;
      default:
        return <Navigate to="/login" />;
    }
  };

  return (
    <div>
      {location.pathname !== "/login" && location.pathname !== "/" && (
        <Header />
      )}
      <Routes>
        <Route path="/" element={<RedirectToRole />} />
        <Route path="*" element={<RedirectToRole />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/admin"
          element={<ProtectedRoute element={<AdminPage />} />}
        />
        <Route
          path="/restaurant-admin"
          element={<ProtectedRoute element={<RestaurantAdminPage />} />}
        />
        <Route
          path="/customer"
          element={<ProtectedRoute element={<CustomerPage onLogout={handleLogout} />} />}
        />
        <Route
          path="/delivery-personnel"
          element={<ProtectedRoute element={<DeliveryPersonnelPage />} />}
        />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
