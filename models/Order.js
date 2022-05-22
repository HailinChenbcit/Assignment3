const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// order
const orderSchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    cart: { type: Array, ref: "Cart" },
  },
  {
    _id: true,
    id: true,
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
