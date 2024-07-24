import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import axios from "axios";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminPage from "./pages/AdminPage";
import RestaurantAdminPage from "./pages/RestaurantAdminPage";
import CustomerPage from "./pages/CustomerPage";
import DeliveryPersonnelPage from "./pages/DeliveryPersonnelPage";
import "./css/App.css";

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
          const response = await axios.get(
            "http://localhost:8000/api/users/me",
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setUser(response.data);
          setUserRole(response.data.role); // Ensure role is set correctly
          if (location.pathname === "/login") {
            navigate("/home");
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
      case "ADMIN":
        return <AdminPage />;
      case "RESTAURANT ADMIN":
        return <RestaurantAdminPage />;
      case "CUSTOMER":
        return <CustomerPage />;
      case "DELIVERY PERSONNEL":
        return <DeliveryPersonnelPage />;
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
      {user && <Header onLogout={handleLogout} />}
      <Routes>
        <Route path="/login" element={<LoginPage setToken={setToken} />} />
        <Route
          path="/register"
          element={<RegisterPage setToken={setToken} />}
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute
              element={<ProfilePage token={token} onLogout={handleLogout} />}
            />
          }
        />
        <Route
          path="/home"
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
