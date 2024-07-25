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
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminHome from "./pages/AdminHome";
import RestaurantAdminHome from "./pages/RestaurantAdminHome";
import CustomerHome from "./pages/CustomerHome";
import DeliveryPersonnelHome from "./pages/DeliveryPersonnelHome";
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
        return <AdminHome />;
      case "RESTAURANT ADMIN":
        return <RestaurantAdminHome />;
      case "CUSTOMER":
        return <CustomerHome />;
      case "DELIVERY PERSONNEL":
        return <DeliveryPersonnelHome />;
      default:
        return <Login setToken={setToken} />;
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
      {user && <Header onLogout={handleLogout} />}
      <div className="App-content">
      <Routes>
        <Route
          path="/"
          element={<Navigate to={token ? "/home" : "/login"} />}
        />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route
          path="/register"
          element={<Register setToken={setToken} />}
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute
              element={<Profile token={token} onLogout={handleLogout} />}
            />
          }
        />
        <Route
          path="/home"
          element={<ProtectedRoute element={renderComponentByRole()} />}
        />
        {/* Handle all unknown routes by redirecting to the previous Home */}
        <Route path="*" element={<RedirectToPreviousHome />} />
      </Routes>
      </div>
      {user && <Footer />}
    </div>
  );
}

export default App;
