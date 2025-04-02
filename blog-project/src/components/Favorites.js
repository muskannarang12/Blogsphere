import React, { useEffect, useState } from "react";
import axios from "axios";
import { Heart } from "lucide-react"; // Import the Heart icon
import { useNavigate } from "react-router-dom"; // For navigation
import "./styles.css"; // Import your CSS file for styling

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

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

  // Remove a blog from favorites
  const handleRemoveFavorite = async (blogId) => {
    try {
      await axios.delete(`http://localhost:5000/api/favorites/${blogId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Update the UI by removing the blog from the favorites list
      setFavorites((prevFavorites) =>
        prevFavorites.filter((blog) => blog._id !== blogId)
      );
    } catch (error) {
      console.error("Error removing from favorites:", error);
    }
  };

  return (
    <div className="favorites-container">
      <h1 className="favorites-header">Your Favorites</h1>
      {favorites.length > 0 ? (
        <div className="favorites-grid">
          {favorites.map((blog) => (
            <div key={blog._id} className="favorite-blog-card">
              {/* Blog Cover Image */}
              {blog.coverImage && (
                <img
                  src={blog.coverImage}
                  alt={blog.title}
                  className="blog-cover-image"
                />
              )}

              {/* Blog Title */}
              <h2 className="blog-title">{blog.title}</h2>

              {/* Author Name and Date/Time */}
              <p className="blog-meta">
                By {blog.authorName} | {new Date(blog.createdAt).toLocaleString()}
              </p>

              {/* Blog Description */}
              <p className="blog-description">{blog.description}</p>

              {/* Blog Content */}
              <p className="blog-content">{blog.content}</p>

              {/* Heart Icon to Remove from Favorites */}
              <div
                className="heart-icon"
                onClick={() => handleRemoveFavorite(blog._id)}
              >
                <Heart size={24} fill="red" stroke="red" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-favorites-message">No favorites yet.</p>
      )}
    </div>
  );
};

export default Favorites;