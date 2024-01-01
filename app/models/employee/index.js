const mongoose = require("mongoose");
const validator = require("validator");

const employeeMaster = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide user ID,"],
  },
  name: {
    type: String,
    required: [true, "Please Enter Employee Name"],
  },
  phone: {
    type: String,
    required: [true, "Please Enter Employee Phone"],
  },
  email: {
    type: String,
    required: [true, "Please Enter Employee Email"],
    unique: true,
    validate: [validator.isEmail, "Please Enter Employee Email"],
  },
  dob: {
    type: String,
    required: [true, "Please Enter Employee Date of Birth"],
  },
  address: {
    type: String,
    required: [true, "Please Enter Employee Address"],
  },
  doc_type: {
    type: String,
    required: [true, "Please Enter Employee Document Type"],
  },
  joining: {
    type: Date,
    required: [true, "Please Enter Employee Date of Joining"],
    default: Date.now,
  },
  gender: {
    type: String,
    required: [true, "Please Enter Employee Gender"],
    enum: ["male", "female"],
    default: "male",
  },
  image: {
    front: {
      type: String,
      required: true,
    },
    back: {
      type: String,
      required: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Employee", employeeMaster);
