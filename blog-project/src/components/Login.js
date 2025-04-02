import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Notification from "./Notification"; // Import the custom notification
import "./styles.css";

const Login = ({ onLogin, isDarkMode }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false); // State for notification
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      console.log("Login successful:", response.data);
      onLogin(response.data.token);
      localStorage.setItem("email", email);
      setShowNotification(true); // Show notification
      setTimeout(() => {
        navigate("/"); // Redirect to home page after notification
      }, 3000); // Wait for 3 seconds before redirecting
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`center-container ${isDarkMode ? "dark-mode" : ""}`}
      style={{ backgroundColor: isDarkMode ? "#121212" : "#f5f5f5" }}
    >
      {showNotification && (
        <Notification
          message="Logged in successfully!"
          onClose={() => setShowNotification(false)}
        />
      )}
      <div
        className={`form-container ${isDarkMode ? "dark-mode" : ""}`}
        style={{
          backgroundColor: isDarkMode ? "#1e1e1e" : "#fff",
          color: isDarkMode ? "#fff" : "#000",
        }}
      >
        <h1>Blogsphere</h1>
        <p>Login using your email address</p>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className={`form-input ${isDarkMode ? "dark-mode" : ""}`}
              style={{
                backgroundColor: isDarkMode ? "#333" : "#fff",
                color: isDarkMode ? "#fff" : "#000",
                border: isDarkMode ? "1px solid #555" : "1px solid #ccc",
              }}
            />
          </div>
          <div style={{ position: "relative" }}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className={`form-input ${isDarkMode ? "dark-mode" : ""}`}
              style={{
                backgroundColor: isDarkMode ? "#333" : "#fff",
                color: isDarkMode ? "#fff" : "#000",
                border: isDarkMode ? "1px solid #555" : "1px solid #ccc",
              }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`submit-button ${isDarkMode ? "dark-mode" : ""}`}
            style={{
              backgroundColor: isDarkMode ? "#6C63FF" : "#6C63FF",
              color: "#fff",
            }}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>
        <div className="links">
          <Link to="/forgot-password" style={{ color: isDarkMode ? "#6C63FF" : "#6C63FF" }}>
            Forgot password?
          </Link>
          <span>|</span>
          <Link to="/signup" style={{ color: isDarkMode ? "#6C63FF" : "#6C63FF" }}>
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;