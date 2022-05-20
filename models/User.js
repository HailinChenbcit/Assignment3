const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// cart

const cartSchema = new Schema({
  pokeID: Number,
  price: Number,
  quantity: Number,
});

// User model
const userSchema = new Schema(
  {
    firstname: String,
    lastname: String,
    email: String,
    password: String,
    admin: Boolean,
    cart: [cartSchema],
  },
  {
    _id: true,
    id: true,
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
