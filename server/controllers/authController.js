const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // Import jwt module
require('dotenv').config(); // Load environment variables

const sendVerificationEmail = require("../utils/email");

exports.signup = async (req, res) => {
  const { email, password } = req.body;

  console.log("Received payload:", req.body); // Debugging log

  if (!email || !password ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Save the user with isVerified: false
    const user = new User({
      email,
      password: hashedPassword,
      verificationCode,
      isVerified: false,
    });

    await user.save();

    // Send the verification email
    await sendVerificationEmail(email, verificationCode);

    res.status(201).json({ message: "User created. Please verify your email.", userId: user._id });
  } catch (err) {
    console.error("Error in signup:", err); // Debugging log
    res.status(500).json({ error: err.message });
  }
};
// Verify Code
exports.verifyCode = async (req, res) => {
  const { userId, verificationCode } = req.body;

  if (!userId || !verificationCode) {
    return res.status(400).json({ error: "User ID and verification code are required" });
  }

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the code matches
    if (verificationCode !== user.verificationCode) {
      return res.status(400).json({ error: "Invalid verification code" });
    }

    // Update the user's verification status
    user.isVerified = true;
    user.verificationCode = null; // Clear the verification code
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Login

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Received login request for email:", email); // Debugging log

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found for email:", email); // Debugging log
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password mismatch for email:", email); // Debugging log
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    console.log("Login successful for email:", email); // Debugging log
    res.json({ token });
  } catch (err) {
    console.error("Error in login:", err); // Debugging log
    res.status(500).json({ error: err.message });
  }
};