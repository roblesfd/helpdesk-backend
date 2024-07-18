const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    name: { type: String },
    lastname: { type: String },
    active: { type: Boolean, default: false },
    roles: {
      type: String,
      enum: ["usuario", "agente", "admin"],
      default: "usuario",
    },
    phoneNumber: { type: String },
    profileImage: { type: String },
    lastLogin: { type: Date },
    token: { type: String },
  },
  {
    virtuals: {
      fullName: {
        get() {
          return this.name + " " + this.lastname;
        },
      },
    },
  }
);

module.exports = mongoose.model("User", userSchema);
