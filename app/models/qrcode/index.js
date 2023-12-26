const mongoose = require("mongoose");

const QrCode = new mongoose.Schema({
  QrCode: {
    type: String,
    required: [true, "Please Provide QR Code"],
  },
  numOfTable: {
    type: Number,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    require: true,
  },
  restaurantId: {
    type: mongoose.Types.ObjectId,
    ref: "Restaurant",
    required: [true, "Please provide restaurant Id,"],
  },
});

module.exports = mongoose.model("QrCode", QrCode);
