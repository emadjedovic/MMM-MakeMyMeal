import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterPage = ({ setToken }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/register", {
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password,
      });
      localStorage.setItem("access_token", response.data.access_token);
      setToken(response.data.access_token); // Update token state
      console.log("Successful registration.");
      navigate("/"); // Navigate to / after successful registration
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login");  // Navigate to /login
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Enter First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Enter Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
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
        <button type="submit">Register</button>
      </form>
      <p>Already have an account?</p>
      <button onClick={handleLoginRedirect}>Login</button>
    </div>
  );
};

export default RegisterPage;
