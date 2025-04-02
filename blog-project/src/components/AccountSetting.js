import React, { useState, useRef } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import Notification from './Notification'; // Import the custom notification component

const AccountSettings = ({ isDarkMode }) => {
  const [profileData, setProfileData] = useState({
    name: "",
    profilePicture: "",
    description: "",
    socialLinks: { twitter: "", linkedin: "", github: "" },
    educationLevel: "",
    educationPlace: "",
    interests: [],
    skills: "",
    languages: "",
    hobbies: "",
    isBlogPublic: true,
  });

  // Get logged-in user's email from localStorage
  const userEmail = localStorage.getItem("email");

  // Initialize useNavigate
  const navigate = useNavigate();

  // Store initial profile data using useRef
  const initialProfileData = useRef(profileData);

  // State for custom notification
  const [showNotification, setShowNotification] = useState(false);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  // Handle social link changes
  const handleSocialLinkChange = (platform, value) => {
    setProfileData({
      ...profileData,
      socialLinks: { ...profileData.socialLinks, [platform]: value },
    });
  };

  // Handle profile picture change
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData({ ...profileData, profilePicture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle interests change
  const handleInterestsChange = (selected) => {
    setProfileData({ ...profileData, interests: selected });
  };

  // Save profile data
  const handleSave = async () => {
    try {
      // Compare current profile data with initial data to find modified fields
      const modifiedFields = {};
      for (const key in profileData) {
        if (profileData[key] !== initialProfileData.current[key]) {
          modifiedFields[key] = profileData[key];
        }
      }

      // Transform interests from array of objects to array of strings
      if (modifiedFields.interests) {
        modifiedFields.interests = modifiedFields.interests.map((interest) => interest.value);
      }

      // Send only modified fields to the backend
      await axios.post("http://localhost:5000/api/profile", {
        email: userEmail,
        profileData: modifiedFields,
      });

      // Show custom notification
      setShowNotification(true);

      // Update initialProfileData to reflect the new state
      initialProfileData.current = profileData;

      // Navigate to the Profile page after saving
      setTimeout(() => {
        navigate("/profile");
      }, 3000); // Wait for 3 seconds before navigating
    } catch (error) {
      console.error("Error saving profile:", error.response?.data || error.message);
      alert("Failed to save profile. Please try again.");
    }
  };

  // Predefined list of interests
  const interestOptions = [
    { value: "science", label: "Science" },
    { value: "technology", label: "Technology" },
    { value: "datascience", label: "Data Science" },
    { value: "programming", label: "Programming" },
    { value: "ai", label: "Artificial Intelligence" },
    { value: "ml", label: "Machine Learning" },
    { value: "webdev", label: "Web Development" },
    { value: "mobile", label: "Mobile Development" },
    { value: "design", label: "Design" },
    { value: "writing", label: "Writing" },
  ];

  return (
    <div
      className={`container my-5 ${isDarkMode ? "bg-dark text-light" : "bg-light text-dark"}`}
      style={{ maxWidth: "800px", borderRadius: "10px", padding: "20px" }}
    >
      {/* Custom Notification */}
      {showNotification && (
        <Notification
          message="Profile updated successfully!"
          onClose={() => setShowNotification(false)}
        />
      )}

      <h1
        className="text-center mb-4"
        style={{ color: "#6C63FF", fontFamily: "Arial, sans-serif", fontWeight: "bold" }}
      >
        Account Settings
      </h1>

      {/* Profile Picture Section */}
      <div className="mb-4">
        <div className="text-center">
          <div
            className="profile-picture-container"
            style={{
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              overflow: "hidden",
              border: "3px solid #6C63FF",
              margin: "0 auto",
            }}
          >
            <img
              src="/profile-placeholder.png" alt="Profile" 
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePictureChange}
            className={`form-control mt-3 ${isDarkMode ? "bg-dark text-light" : ""}`}
            style={{ maxWidth: "300px", margin: "0 auto" }}
          />
        </div>
      </div>

      {/* Name and Email Section */}
      <div className="mb-4">
        <h3 style={{ color: "#6C63FF" }}>Personal Information</h3>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              className={`form-control ${isDarkMode ? "bg-dark text-light" : ""}`}
              id="name"
              name="name"
              value={profileData.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              className={`form-control ${isDarkMode ? "bg-dark text-light" : ""}`}
              id="email"
              name="email"
              value={userEmail}
              readOnly
              placeholder="Enter your email"
            />
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="description">Description</label>
          <textarea
            className={`form-control ${isDarkMode ? "bg-dark text-light" : ""}`}
            id="description"
            name="description"
            rows="3"
            value={profileData.description}
            onChange={handleInputChange}
            placeholder="Tell us about yourself"
          />
        </div>
      </div>

      {/* Social Links Section */}
      <div className="mb-4">
        <h3 style={{ color: "#6C63FF" }}>Social Links</h3>
        <div className="row">
          <div className="col-md-4 mb-3">
            <label htmlFor="twitter">Twitter</label>
            <input
              type="url"
              className={`form-control ${isDarkMode ? "bg-dark text-light" : ""}`}
              id="twitter"
              value={profileData.socialLinks.twitter}
              onChange={(e) => handleSocialLinkChange("twitter", e.target.value)}
              placeholder="https://twitter.com/username"
            />
          </div>
          <div className="col-md-4 mb-3">
            <label htmlFor="linkedin">LinkedIn</label>
            <input
              type="url"
              className={`form-control ${isDarkMode ? "bg-dark text-light" : ""}`}
              id="linkedin"
              value={profileData.socialLinks.linkedin}
              onChange={(e) => handleSocialLinkChange("linkedin", e.target.value)}
              placeholder="https://linkedin.com/in/username"
            />
          </div>
          <div className="col-md-4 mb-3">
            <label htmlFor="github">GitHub</label>
            <input
              type="url"
              className={`form-control ${isDarkMode ? "bg-dark text-light" : ""}`}
              id="github"
              value={profileData.socialLinks.github}
              onChange={(e) => handleSocialLinkChange("github", e.target.value)}
              placeholder="https://github.com/username"
            />
          </div>
        </div>
      </div>

      {/* Education Section */}
      <div className="mb-4">
        <h3 style={{ color: "#6C63FF" }}>Education</h3>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="educationLevel">Education Level</label>
            <select
              className={`form-select ${isDarkMode ? "bg-dark text-light" : ""}`}
              id="educationLevel"
              name="educationLevel"
              value={profileData.educationLevel}
              onChange={handleInputChange}
            >
              <option value="">Select education level</option>
              <option value="O Level">O Level</option>
              <option value="A Level">A Level</option>
              <option value="Graduation">Graduation</option>
              <option value="Master">Master</option>
              <option value="PhD">PhD</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="educationPlace">Place of Education</label>
            <input
              type="text"
              className={`form-control ${isDarkMode ? "bg-dark text-light" : ""}`}
              id="educationPlace"
              name="educationPlace"
              value={profileData.educationPlace}
              onChange={handleInputChange}
              placeholder="Enter the place of education (optional)"
            />
          </div>
        </div>
      </div>

      {/* Area of Interest Section */}
      <div className="mb-4">
        <h3 style={{ color: "#6C63FF" }}>Area of Interest</h3>
        <Select
          isMulti
          options={interestOptions}
          value={profileData.interests}
          onChange={handleInterestsChange}
          placeholder="Select your interests..."
          className={`${isDarkMode ? "text-dark" : ""}`}
          styles={{
            control: (base) => ({
              ...base,
              backgroundColor: isDarkMode ? "#343a40" : "#fff",
              borderColor: isDarkMode ? "#6C63FF" : "#ced4da",
              color: isDarkMode ? "#fff" : "#000",
            }),
            menu: (base) => ({
              ...base,
              backgroundColor: isDarkMode ? "#343a40" : "#fff",
              color: isDarkMode ? "#fff" : "#000",
            }),
            option: (base, { isFocused }) => ({
              ...base,
              backgroundColor: isFocused ? (isDarkMode ? "#6C63FF" : "#e9ecef") : "transparent",
              color: isDarkMode ? "#fff" : "#000",
            }),
          }}
        />
      </div>

      {/* Skills, Languages, and Hobbies Section */}
      <div className="mb-4">
        <h3 style={{ color: "#6C63FF" }}>Additional Information</h3>
        <div className="row">
          <div className="col-md-4 mb-3">
            <label htmlFor="skills">Skills</label>
            <input
              type="text"
              className={`form-control ${isDarkMode ? "bg-dark text-light" : ""}`}
              id="skills"
              name="skills"
              value={profileData.skills}
              onChange={handleInputChange}
              placeholder="Enter your skills"
            />
          </div>
          <div className="col-md-4 mb-3">
            <label htmlFor="languages">Languages</label>
            <input
              type="text"
              className={`form-control ${isDarkMode ? "bg-dark text-light" : ""}`}
              id="languages"
              name="languages"
              value={profileData.languages}
              onChange={handleInputChange}
              placeholder="Enter languages you know"
            />
          </div>
          <div className="col-md-4 mb-3">
            <label htmlFor="hobbies">Hobbies</label>
            <input
              type="text"
              className={`form-control ${isDarkMode ? "bg-dark text-light" : ""}`}
              id="hobbies"
              name="hobbies"
              value={profileData.hobbies}
              onChange={handleInputChange}
              placeholder="Enter your hobbies (optional)"
            />
          </div>
        </div>
      </div>

      {/* Blog Privacy Section */}
      <div className="mb-4">
        <h3 style={{ color: "#6C63FF" }}>Blog Privacy</h3>
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            id="blogPrivacy"
            checked={profileData.isBlogPublic}
            onChange={(e) =>
              setProfileData({ ...profileData, isBlogPublic: e.target.checked })
            }
          />
          <label className="form-check-label" htmlFor="blogPrivacy">
            Make my blogs {profileData.isBlogPublic ? "public" : "private"}
          </label>
        </div>
      </div>

      {/* Save Button */}
      <div className="text-center">
        <button
          type="submit"
          className="btn btn-primary"
          onClick={handleSave}
          style={{ backgroundColor: "#6C63FF", border: "none", padding: "10px 20px" }}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default AccountSettings;