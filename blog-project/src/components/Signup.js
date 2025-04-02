import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Notification from "./Notification"; // Import the custom notification
import "./styles.css";

const Signup = ({ onSignup, isDarkMode }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false); // State for notification
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/auth/signup", {
        email,
        password,
      });
      console.log("Signup successful:", response.data);
      onSignup(response.data.token);
      setShowNotification(true); // Show notification
      setTimeout(() => {
        navigate("/verify-code", { state: { userId: response.data.userId } });
      }, 3000); // Wait for 3 seconds before redirecting
    } catch (err) {
      console.error("Signup error:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Signup failed. Please try again.");
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
          message="Verification code has been sent to your email. Please check your inbox."
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
        <p>Create your Blogsphere account</p>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSignup}>
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
          <div style={{ position: "relative" }}>
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
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
            {loading ? "Signing up..." : "Sign up"}
          </button>
        </form>
        <div className="links">
          <Link to="/login" style={{ color: isDarkMode ? "#6C63FF" : "#6C63FF" }}>
            Already have an account? Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;