const mongoose = require("mongoose");


// Clear the model cache
delete mongoose.connection.models['User'];
const userSchema = new mongoose.Schema({
  
  // Authentication fields
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  verificationCode: { type: String },
  themePreference: { type: String, default: "light" },
  createdAt: { type: Date, default: Date.now },

  
});

module.exports = mongoose.model("User", userSchema);