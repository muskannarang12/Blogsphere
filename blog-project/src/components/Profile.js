import React, { useEffect, useState } from "react";
import { Card, Button, Container, Row, Col, ListGroup } from "react-bootstrap";
import axios from "axios";

const Profile = ({ isDarkMode }) => {
  const [profileData, setProfileData] = useState({});
  const [error, setError] = useState("");
  const userEmail = localStorage.getItem("email"); // Get logged-in user's email

  console.log("Logged-in user email:", userEmail);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (!userEmail) {
          setError("No email found. Please log in again.");
          return;
        }
        const response = await axios.get(`http://localhost:5000/api/profile/${userEmail}`);
        console.log("Profile data received:", response.data); // Log the profile data
        setProfileData(response.data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setError("Failed to fetch profile data. Please try again.");
      }
    };

    fetchProfileData();
  }, [userEmail]); // Use userEmail as the dependency

  return (
    <Container className={`py-4 ${isDarkMode ? "bg-dark text-light" : ""}`}>
      <h2 className="text-center mb-4">Profile</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <Card className={isDarkMode ? "bg-dark text-light" : ""}>
        <Card.Body>
          <Row>
            <Col md={4} className="text-center">
              <div
                className="profile-picture-container mb-3"
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
                  src={profileData.profilePicture || "https://via.placeholder.com/150"}
                  alt="Profile"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <h4>{profileData.name}</h4>
              <p className="text-muted">{profileData.description}</p>
            </Col>
            <Col md={8}>
              <ListGroup variant="flush">
                <ListGroup.Item className={isDarkMode ? "bg-dark text-light" : ""}>
                  <strong>Email:</strong> {userEmail}
                </ListGroup.Item>
                <ListGroup.Item className={isDarkMode ? "bg-dark text-light" : ""}>
                  <strong>Education:</strong> {profileData.educationLevel} at {profileData.educationPlace}
                </ListGroup.Item>
                <ListGroup.Item className={isDarkMode ? "bg-dark text-light" : ""}>
                  <strong>Interests:</strong> {profileData.interests?.join(", ")}
                </ListGroup.Item>
                <ListGroup.Item className={isDarkMode ? "bg-dark text-light" : ""}>
                  <strong>Skills:</strong> {profileData.skills}
                </ListGroup.Item>
                <ListGroup.Item className={isDarkMode ? "bg-dark text-light" : ""}>
                  <strong>Languages:</strong> {profileData.languages}
                </ListGroup.Item>
                <ListGroup.Item className={isDarkMode ? "bg-dark text-light" : ""}>
                  <strong>Hobbies:</strong> {profileData.hobbies}
                </ListGroup.Item>
                <ListGroup.Item className={isDarkMode ? "bg-dark text-light" : ""}>
                  <strong>Social Links:</strong>
                  <ul className="list-unstyled">
                    <li>
                      <strong>Twitter:</strong>{" "}
                      <a href={profileData.socialLinks?.twitter} target="_blank" rel="noopener noreferrer" className={isDarkMode ? "text-light" : ""}>
                        {profileData.socialLinks?.twitter}
                      </a>
                    </li>
                    <li>
                      <strong>LinkedIn:</strong>{" "}
                      <a href={profileData.socialLinks?.linkedin} target="_blank" rel="noopener noreferrer" className={isDarkMode ? "text-light" : ""}>
                        {profileData.socialLinks?.linkedin}
                      </a>
                    </li>
                    <li>
                      <strong>GitHub:</strong>{" "}
                      <a href={profileData.socialLinks?.github} target="_blank" rel="noopener noreferrer" className={isDarkMode ? "text-light" : ""}>
                        {profileData.socialLinks?.github}
                      </a>
                    </li>
                  </ul>
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Profile;