const express = require("express");
const Profile = require("../models/Profile");
const User = require("../models/User"); // Corrected import
const router = express.Router();

//save profile data
router.post("/profile", async (req, res) => {
  try {
      const { email, profileData } = req.body;

      console.log("Received email:", email);
      console.log("Profile data:", profileData);

      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
          console.log("User not found:", email);
          return res.status(404).json({ error: "User not found" });
      }

      // Create or update the profile
      const profile = await Profile.findOneAndUpdate(
          { user: user._id }, // Find profile by user ID
          { $set: { user: user._id, ...profileData } }, // Use `$set` to update only provided fields
          { upsert: true, new: true, runValidators: true } // Create if not found & apply schema validation
      );

      console.log("Profile saved:", profile);
      res.status(200).json(profile);
  } catch (error) {
      console.error("Error saving profile:", error);
      res.status(500).json({ error: "Error saving profile: " + error.message });
  }
});

// Fetch profile data
router.get("/profile/:email", async (req, res) => {
  try {
    const userEmail = req.params.email; 
    console.log("Requested email:", userEmail);

    // Find user by email
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find profile using the user's ID
    const profile = await Profile.findOne({ user: user._id });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;