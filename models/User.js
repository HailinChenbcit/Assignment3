const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// User model
const userSchema = new Schema(
  {
    firstname: String,
    lastname: String,
    email: String,
    password: String,
    admin: Boolean,
  },
  {
    _id: true,
    id: true,
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
