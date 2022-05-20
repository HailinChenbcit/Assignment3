const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// cart
const cartSchema = new Schema(
  {    
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    pokeID: Number,
    price: Number,
    quantity: Number,
  },
  {
    _id: true,
    id: true,
    timestamps: true,
  }
);

module.exports = mongoose.model("Cart", cartSchema);
