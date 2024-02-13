const mongoose = require("mongoose");

const UpiMaster = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  bankId: {
    type: mongoose.Schema.ObjectId,
    ref: "Bank",
    required: true,
  },
  bank: {
    type: String,
    required: [true, "Please Enter Bank"],
  },
  name: {
    type: String,
    required: [true, "Please Enter UPI Name"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Upi", UpiMaster);
