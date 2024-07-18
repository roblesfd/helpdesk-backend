const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ["abierto", "en progreso", "cerrado"],
    default: "abierto",
  },
  priority: { type: String, enum: ["baja", "media", "alta"], default: "media" },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Ticket", ticketSchema);
