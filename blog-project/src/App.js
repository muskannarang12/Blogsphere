import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import BlogDetail from "./pages/BlogDetail";
import Login from "./components/Login";
import Signup from "./components/Signup";
import AccountSetting from "./components/AccountSetting";
import BlogUpload from "./components/BlogUpload";
import VerifyCode from "./components/VerifyCode";
import Profile from "./components/Profile";
import UploadedBlogs from "./components/UploadedBlogs";
import Favorites from './components/Favorites';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Initially, user is not logged in
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check if the user is logged in on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true); // User is logged in
    }
  }, []);

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLogin = (token) => {
    localStorage.setItem("token", token); // Store the token in localStorage
    setIsLoggedIn(true); // Update login state
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove the token from localStorage
    setIsLoggedIn(false); // Update login state
    console.log("User logged out");
  };

  return (
    <Router>
      <Navbar
        isLoggedIn={isLoggedIn} // Pass the logged-in state to Navbar
        isDarkMode={isDarkMode}
        onThemeToggle={handleThemeToggle}
        onLogout={handleLogout}
      />
      <Routes>
        <Route path="/" element={<Home isDarkMode={isDarkMode} />} />
        <Route path="/login" element={<Login onLogin={handleLogin} isDarkMode={isDarkMode} />} />
        <Route path="/signup" element={<Signup onSignup={handleLogin} isDarkMode={isDarkMode} />} />
        <Route path="/verify-code" element={<VerifyCode isDarkMode={isDarkMode} />} />
        <Route path="/account-settings" element={<AccountSetting  isDarkMode={isDarkMode}  />} />
        <Route path="/create-blog" element={<BlogUpload isDarkMode={isDarkMode} />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/uploaded-blogs" element={<UploadedBlogs isDarkMode={isDarkMode}/>} /> {/* Updated route */}
        <Route path="/Profile" element={<Profile isDarkMode={isDarkMode}/>} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </Router>
  );
};

export default App;