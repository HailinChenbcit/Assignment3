const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Time Event model
const eventSchema = new Schema({
  text: String,
  hits: Number,
  time: String,
});

module.exports = mongoose.model("timelineevents", eventSchema);
