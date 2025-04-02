const express = require("express");
const Profile = require("../models/Profile");
const verifyToken = require("../middleware/authMiddleware"); // Add authentication middleware

const router = express.Router();

// Add a blog to favorites
router.post("/favorites/:blogId", verifyToken, async (req, res) => {
  const { blogId } = req.params;
  const userId = req.user.id;

  try {
    // Check if the blog is already favorited
    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    if (profile.favorites.includes(blogId)) {
      return res.status(400).json({ error: "Blog already favorited" });
    }

    // Add the blog to favorites
    await Profile.findOneAndUpdate(
      { user: userId },
      { $push: { favorites: blogId } },
      { new: true }
    );

    res.status(200).json({ message: "Blog added to favorites" });
  } catch (error) {
    console.error("Error adding to favorites:", error);
    res.status(500).json({ error: "Failed to add to favorites" });
  }
});

// Remove a blog from favorites
router.delete("/favorites/:blogId", verifyToken, async (req, res) => {
  const { blogId } = req.params;
  const userId = req.user.id;

  try {
    // Remove the blog from favorites
    await Profile.findOneAndUpdate(
      { user: userId },
      { $pull: { favorites: blogId } },
      { new: true }
    );

    res.status(200).json({ message: "Blog removed from favorites" });
  } catch (error) {
    console.error("Error removing from favorites:", error);
    res.status(500).json({ error: "Failed to remove from favorites" });
  }
});

// Fetch favorited blogs
router.get("/favorites", verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const profile = await Profile.findOne({ user: userId }).populate("favorites");
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.status(200).json(profile.favorites);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ error: "Failed to fetch favorites" });
  }
});

module.exports = router;