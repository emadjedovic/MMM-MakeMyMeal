import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("")
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/auth/login", {
        email: email,
        password: password,
      });
      localStorage.setItem("access_token", response.data.access_token);
      setToken(response.data.access_token); // Update token state
      console.log("Successful login.");
      navigate("/home"); // Navigate to / after successful login
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Incorrect email or password.");
    }
  };

  const handleRegisterRedirect = () => {
    navigate("/register"); // Navigate to /register
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <p>Don't have an account?</p>
      <button onClick={handleRegisterRedirect}>Register</button>
    </div>
  );
};

export default LoginPage;
