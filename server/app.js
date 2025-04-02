require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const blogRoutes = require('./routes/blog');
const userRoutes = require("./routes/user"); 
const favRoutes = require("./routes/favorites"); 
const cors = require("cors");

const app = express();

// Connect to MongoDB
connectDB();

const session = require('express-session');

// Middleware for sessions
app.use(session({
  secret: process.env.SESSION_SECRET || 'mysecretkey', 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Change `false` to `true` in production with HTTPS
}));

app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// Middleware
app.use(express.json());

// Routes

app.use("/api/auth", authRoutes); 
app.use("/api", userRoutes); 
app.use('/api', blogRoutes);
app.use('/api', favRoutes);
// Error handling
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));