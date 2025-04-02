const express = require("express");
const Blog = require("../models/Blog");

const Profile = require("../models/Profile");
const authenticateUser = require("../middleware/authMiddleware");
const router = express.Router();

//to create blog
router.post('/blogs', authenticateUser, async (req, res) => {
  try {
    const { title, description, content, tags, coverImage, technology, readingTime, authorName, isFeatured } = req.body;

    if (!title || !description || !content || !technology) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Ensure req.user is populated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const newBlog = new Blog({
      title,
      description,
      content,
      tags,
      coverImage,
      technology,
      readingTime,
      authorName: authorName || req.user.name || 'Anonymous',
      isFeatured,
      user: req.user._id, // Associate the blog with the authenticated user
    });

    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    console.error('Error saving blog:', error);
    res.status(500).json({ error: 'Error saving blog: ' + error.message });
  }
});

router.get("/blogss/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("user", "name email"); // Populate user details
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    // Fetch the profile of the user who created the blog
    const profile = await Profile.findOne({ user: blog.user._id });
    if (profile) {
      // Add profilePicture and name to the user object
      blog.user = {
        ...blog.user._doc, // Spread the existing user data
        profilePicture: profile.profilePicture,
        name: profile.name || blog.user.name, // Use profile name if available, otherwise fallback to user name
      };
    }

    console.log("Blog with profilePicture:", blog); // Debugging
    res.json(blog);
  } catch (error) {
    console.error("Error fetching blog details:", error);
    res.status(500).json({ error: "Failed to fetch blog details" });
  }
});
// Get all blogs on homepage
router.get("/blogss", async (req, res) => {
  try {
    const blogs = await Blog.find().populate("user", "name email"); // Populate user details

    // Fetch profile data for each blog's user
    const blogsWithProfile = await Promise.all(
      blogs.map(async (blog) => {
        const profile = await Profile.findOne({ user: blog.user._id });
        if (profile) {
          blog.user = {
            ...blog.user._doc, // Spread the existing user data
            profilePicture: profile.profilePicture,
            name: profile.name || blog.user.name, // Use profile name if available, otherwise fallback to user name
          };
        }
        return blog;
      })
    );

    res.json(blogsWithProfile);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
});
router.get('/my-blogs', authenticateUser, async (req, res) => {
  try {
    console.log("Authenticated User:", req.user); // Debugging

    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "User ID not found" });
    }

    const blogs = await Blog.find({ user: req.user._id });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
});



module.exports = router;