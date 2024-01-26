const mongoose = require("mongoose");

const RestaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide restaurant name"],
  },
  address: {
    type: String,
    required: [true, "Please provide address"],
  },
  city: {
    type: String,
  },
  postalcode: {
    type: Number,
  },
  phoneNo: {
    type: Number,
    required: [true, "Please provide phone number"],
    minLength: 10,
  },

  openTime: {
    type: String,
  },
  closeTime: {
    type: String,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide user id,"],
  },
  logo: {
    type: String,
  },
});

module.exports = mongoose.model("Restaurant", RestaurantSchema);
