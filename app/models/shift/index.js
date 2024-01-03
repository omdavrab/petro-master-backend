const mongoose = require("mongoose");

const ShiftMaster = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: [true, "Please Enter Shift Name"],
  },
  openTime: {
    type: String,
    required: [true, "Please Enter Shift Open Time"],
  },
  closeTime: {
    type: String,
    required: [true, "Please Enter Shift Close Time"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Shift", ShiftMaster);
