const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// User model
const userSchema = new Schema({
  firstname: String,
  lastname: String,
  email: String,
  password: String,
  admin: Boolean,
  cart: Array,
});

module.exports = mongoose.model('User', userSchema)