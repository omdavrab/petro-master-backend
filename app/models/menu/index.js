const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
  },
  category: {
    type: String,
    required: [true, "Category is required"],
  },
  vegetarian: {
    type: Boolean,
    default: true,
  },
  description: {
    type: String,
  },
  customizeable: {
    type: Boolean,
    default: false,
  },
  // customizeItem: {
  //   type: String,
  // },
  customizeItem: [
    {
      customizeItem: String,
      customizeItemPrice:String,
    },
  ],
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
  categoryId: {
    type: mongoose.Types.ObjectId,
    ref: "FoodCategory",
    required: [true, "Please provide FoodCategory Id,"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Menu", menuSchema);
