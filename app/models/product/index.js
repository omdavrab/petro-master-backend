const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide user ID,"],
  },
  name: {
    type: String,
    required: [true, "Please Enter Name"],
  },
  total_Quantity: {
    type: Number,
    required: [true, "Please Enter QTY"],
  },
  available_Quantity: {
    type: Number,
    required: [true, "Please Enter available_Quantity"],
  },
  price: {
    type: Number,
    required: [true, "Please Enter Price"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
