import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    setUserRole(null);
    localStorage.removeItem("access_token");
    navigate("/login");
  };

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
          if (location.pathname === "/login") {
            navigate("/");
          }
        } catch (error) {
          console.error("Failed to fetch user data", error);
          handleLogout();
        }
      }
    };

    fetchUser();
  }, [token, location.pathname, navigate]);

  const ProtectedRoute = ({ element }) => {
    return user ? element : <Navigate to="/login" />;
  };

  const renderComponentByRole = () => {
    switch (userRole) {
      case "admin":
        return <AdminPage onLogout={handleLogout} />;
      case "restaurant_admin":
        return <RestaurantAdminPage onLogout={handleLogout} />;
      case "customer":
        return <CustomerPage onLogout={handleLogout} />;
      case "delivery_personnel":
        return <DeliveryPersonnelPage onLogout={handleLogout} />;
      default:
        return <LoginPage setToken={setToken} />;
    }
  };

  // Custom component to handle unknown routes by redirecting to the previous page
  const RedirectToPreviousPage = () => {
    const navigate = useNavigate();
    useEffect(() => {
      navigate(-1); // Go back to the previous page
    }, [navigate]);

    return null;
  };


  return (
    <div>
      {
      location.pathname !== "/" &&
      location.pathname !== "/login" &&
      location.pathname !== "/register" &&
      (
        <Header />
      )}
      <Routes>
        <Route path="/login" element={<LoginPage setToken={setToken} />} />
        <Route path="/register" element={<RegisterPage setToken={setToken} />} />
        <Route
          path="/"
          element={<ProtectedRoute element={renderComponentByRole()} />}
        />
        {/* Handle all unknown routes by redirecting to the previous page */}
        <Route path="*" element={<RedirectToPreviousPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
