const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Time Event model
const eventSchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    text: String,
    time: String,
  },
  {
    _id: true,
    id: true,
    timestamps: true,
  }
);

module.exports = mongoose.model("timelineevents", eventSchema);
