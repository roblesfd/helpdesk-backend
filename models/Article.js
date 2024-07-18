const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: { type: String, required: true },
  content: {
    type: String,
    required: true,
  },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Article", articleSchema);
