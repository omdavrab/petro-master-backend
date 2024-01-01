const mongoose = require("mongoose");

const RateMaster = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: [true, "Please Enter Date"],
  },
  msRate: {
    type: Number,
    required: [true, "Please Enter MS Rate"],
  },
  hsdRate: {
    type: Number,
    required: [true, "Please Enter HSD Rate"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Rate", RateMaster);
