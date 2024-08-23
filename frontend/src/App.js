import React, { useContext, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { UserContext } from "./contexts/UserContext";
import Sidebar from "./components/Sidebar";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminPage from "./pages/AdminPage";
import RestaurantAdminPage from "./pages/RestaurantAdminPage";
import CustomerPage from "./pages/CustomerPage";
import DeliveryPersonnelPage from "./pages/DeliveryPersonnelPage";
import NotificationsPage from "./pages/NotificationsPage";
import AllChats from "./chat/AllChats";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import Chat from "./chat/Chat";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./css/App.css";
import "./css/AppLight.css";
import "./css/AppDark.css";

function App() {
  const { user, userRole } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && location.pathname === "/login") {
      navigate("/");
    }
  }, [user, location.pathname, navigate]);

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
        return <LoginPage />;
    }
  };

  const RedirectToPrevious = () => {
    const navigate = useNavigate();
    useEffect(() => {
      navigate(-1);
    }, [navigate]);

    return null;
  };

  return (
    <div className="App">
      <ToastContainer />
      {user && <Sidebar />}
      <div className="App-content">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/profile"
            element={<ProtectedRoute element={<ProfilePage />} />}
          />
          <Route
            path="/notifications"
            element={<ProtectedRoute element={<NotificationsPage />} />}
          />
          <Route
            path="/chats/:chatId/:chatFirstName"
            element={<ProtectedRoute element={<Chat />} />}
          />
          <Route
            path="/chats"
            element={<ProtectedRoute element={<AllChats />} />}
          />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route
            path="/"
            element={<ProtectedRoute element={renderComponentByRole()} />}
          />
          <Route path="*" element={<RedirectToPrevious />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
