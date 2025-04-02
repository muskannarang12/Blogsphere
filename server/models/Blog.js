const mongoose = require("mongoose");
const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  tags: [{ type: String }],
  coverImage: { type: String },
  technology: { type: String, required: true },
  readingTime: { type: String },
  authorName: { type: String, required: true },
  isFeatured: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Blog", BlogSchema);
