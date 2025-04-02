import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyCode = () => {
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state?.userId; // Get userId from location state

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!verificationCode) {
      setError("Verification code is required");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/verify-code', {
        userId,
        verificationCode,
      });
      console.log("Verification successful:", response.data);
      navigate("/login"); // Redirect to login page after successful verification
    } catch (err) {
      console.error("Verification error:", err);
      if (err.response) {
        // Server responded with a status code outside the 2xx range
        setError(err.response.data.error || "Verification failed. Please try again.");
      } else if (err.request) {
        // The request was made but no response was received
        setError("Network error. Please check your connection.");
      } else {
        // Something happened in setting up the request
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="center-container">
      <div className="form-container">
        <h1>Verify Your Email</h1>
        <p>Enter the verification code sent to your email.</p>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleVerifyCode}>
          <div>
            <label htmlFor="verification-code">Verification Code</label>
            <input
              id="verification-code"
              name="verification-code"
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter verification code"
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Verify Code"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyCode;