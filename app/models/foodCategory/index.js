const mongoose = require("mongoose");

const foodCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  image: {
    type: String,
    required: [true, "Image is required"],
  },
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

module.exports = mongoose.model("FoodCategory", foodCategorySchema);
