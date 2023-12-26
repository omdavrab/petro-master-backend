const mongoose = require("mongoose");

const Notification = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide user ID,"],
  },
  restaurantId: {
    type: mongoose.Types.ObjectId,
    ref: "Restaurant",
    required: [true, "Please provide restaurant Id,"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Notification", Notification);
