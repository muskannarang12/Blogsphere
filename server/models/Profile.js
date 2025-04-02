
const mongoose = require("mongoose");
const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the User model
  name: String,
  profilePicture: String,
  description: String,
  socialLinks: {
    twitter: String,
    linkedin: String,
    github: String,
  },
  educationLevel: String,
  educationPlace: String,
  interests: [String], // Array of strings
  skills: String,
  languages: String,
  hobbies: String,
  isBlogPublic: { type: Boolean, default: true },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }], // Array of blog IDs
});

module.exports = mongoose.model("Profile", profileSchema);