import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Pagination, Card, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react"; // Import the Heart icon
import "./styles.css";

const Home = ({ isDarkMode }) => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState([]); // State to store favorited blogs
  const blogsPerPage = 9; // 3 cards per row * 3 rows = 9 blogs per page
  const navigate = useNavigate();

  // Fetch blogs from the backend
  useEffect(() => {
    axios.get("http://localhost:5000/api/blogss")
      .then((response) => {
        setBlogs(response.data);
        setFilteredBlogs(response.data); // Initially, display all blogs
      })
      .catch((err) => console.error("Error fetching blogs:", err));
  }, []);

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
  const handleFavoriteToggle = async (blogId) => {
    try {
      if (favorites.includes(blogId)) {
        await axios.delete(`http://localhost:5000/api/favorites/${blogId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setFavorites((prevFavorites) => prevFavorites.filter((id) => id !== blogId));
      } else {
        await axios.post(
          `http://localhost:5000/api/favorites/${blogId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setFavorites((prevFavorites) => [...prevFavorites, blogId]);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  // Pagination logic
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle blog click to view details
  const handleBlogClick = (blogId) => {
    navigate(`/blog/${blogId}`); // Navigate to the blog detail page
  };

  return (
    <Container className={`mt-5 ${isDarkMode ? "bg-dark text-light" : ""}`}>
      {/* Display Blogs in a Grid Layout */}
      <Row xs={1} md={2} lg={3} className="g-4">
        {currentBlogs.map((blog) => (
          <Col key={blog._id}>
            <Card
              className={`h-100 ${isDarkMode ? "bg-secondary text-light" : ""}`}
              onClick={() => handleBlogClick(blog._id)}
              style={{ cursor: "pointer", transition: "transform 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              {/* Blog Cover Image */}
              {blog.coverImage && (
                <Card.Img
                  variant="top"
                  src={blog.coverImage}
                  alt={blog.title}
                  style={{ height: "200px", objectFit: "cover" }}
                />
              )}

              <Card.Body>
                {/* Blog Title */}
                <Card.Title>{blog.title}</Card.Title>

                {/* Author Profile Picture and Name */}
                <div className="d-flex align-items-center mb-3">
                  <div
                    className="author-icon me-2"
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      overflow: "hidden",
                      border: "2px solid #6C63FF",
                    }}
                  >
                    <img
                      src={blog.user?.profilePicture || "https://via.placeholder.com/40"}
                      alt={blog.user?.name || "Author"}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <Card.Text className="mb-0">
                    <small className="text-muted">
                      By {blog.user?.name || "Unknown Author"}
                    </small>
                  </Card.Text>
                </div>

                {/* Heart Icon for Favorites */}
                <div
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click event
                    handleFavoriteToggle(blog._id);
                  }}
                  style={{ cursor: "pointer", position: "absolute", top: "10px", right: "10px" }}
                >
                  <Heart
                    size={24}
                    fill={favorites.includes(blog._id) ? "red" : "none"}
                    stroke={favorites.includes(blog._id) ? "red" : "gray"}
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Pagination */}
      <div className="d-flex justify-content-center mt-4">
        <Pagination>
          {Array.from({ length: Math.ceil(filteredBlogs.length / blogsPerPage) }, (_, i) => (
            <Pagination.Item
              key={i + 1}
              active={i + 1 === currentPage}
              onClick={() => paginate(i + 1)}
              className={isDarkMode ? "bg-dark text-light" : ""}
            >
              {i + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </div>
    </Container>
  );
};

export default Home;