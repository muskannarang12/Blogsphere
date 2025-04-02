import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Container, Card, Row, Col } from "react-bootstrap";
import { Heart } from "lucide-react"; // Import the Heart icon

const BlogDetail = ({ isDarkMode }) => {
  const { id } = useParams(); // Get the blog ID from the URL
  const [blog, setBlog] = useState(null);
  const [favorites, setFavorites] = useState([]); // State to store favorited blogs

  // Fetch the blog details
  useEffect(() => {
    axios.get(`http://localhost:5000/api/blogss/${id}`)
      .then((response) => {
        setBlog(response.data);
      })
      .catch((err) => console.error("Error fetching blog details:", err));
  }, [id]);

  // Fetch user's favorites
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/favorites", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setFavorites(response.data);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, []);

  // Handle favorite toggle
  const handleFavoriteToggle = async () => {
    try {
      if (favorites.includes(id)) {
        await axios.delete(`http://localhost:5000/api/favorites/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setFavorites((prevFavorites) => prevFavorites.filter((blogId) => blogId !== id));
      } else {
        await axios.post(
          `http://localhost:5000/api/favorites/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setFavorites((prevFavorites) => [...prevFavorites, id]);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  if (!blog) {
    return <Container className="mt-5">Loading...</Container>;
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            {/* Blog Cover Image */}
            {blog.coverImage && (
              <Card.Img
                variant="top"
                src={blog.coverImage}
                alt={blog.title}
                style={{ height: "300px", objectFit: "cover" }}
              />
            )}

            <Card.Body className="text-center">
              {/* Circular Author Icon */}
              <div
                className="author-icon mb-3"
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "3px solid #6C63FF",
                  margin: "0 auto",
                }}
              >
                <img
                  src={blog.user?.profilePicture || "https://via.placeholder.com/100"}
                  alt={blog.user?.name || "Author"}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              {/* Blog Title */}
              <Card.Title>{blog.title}</Card.Title>

              {/* Author Name and Date/Time */}
              <Card.Text>
                <small className="text-muted">
                  By {blog.user?.name || "Unknown Author"} | {new Date(blog.createdAt).toLocaleString()}
                </small>
              </Card.Text>

              {/* Heart Icon for Favorites */}
              <div
                onClick={handleFavoriteToggle}
                style={{ cursor: "pointer", position: "absolute", top: "10px", right: "10px" }}
              >
                <Heart
                  size={24}
                  fill={favorites.includes(id) ? "red" : "none"}
                  stroke={favorites.includes(id) ? "red" : "gray"}
                />
              </div>

              {/* Blog Content */}
              <Card.Text className="text-start">{blog.content}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BlogDetail;