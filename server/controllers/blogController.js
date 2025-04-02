const Blog = require('../models/Blog');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables

console.log("JWT_SECRET:", process.env.JWT_SECRET);

exports.createBlog = async (req, res) => {
  try {
    console.log('Request Body:', req.body); // Log the request body for debugging
    console.log('Authenticated User:', req.user); // Check if user is available

    const { title, description, content, technology, tags, coverImage, readingTime, authorName, isFeatured } = req.body;

    // Validate required fields
    if (!title || !description || !content || !technology) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    console.log("User from Request in Blog Upload:", req.user); // Debugging
    // Ensure the authenticated user exists
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: "Unauthorized: No user found in request." });
    }

    // Create a new blog
    const newBlog = new Blog({
      title,
      description,
      content,
      technology,
      tags,
      coverImage,
      readingTime,
      authorName: authorName || req.user.name || "Anonymous",
      isFeatured,
      user: req.user.userId, // Associate blog with the authenticated user
    });

    await newBlog.save();
    res.status(201).json({ message: 'Blog created successfully!', blog: newBlog });
  } catch (error) {
    console.error('Error creating blog:', error); // Log the error
    res.status(500).json({ error: 'Failed to create blog', details: error.message });
  }
};
