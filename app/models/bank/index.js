const mongoose = require("mongoose");

const BankMaster = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  accountNo: {
    type: Number,
    required: [true, "Please Enter Account Number"],
  },
  bankName: {
    type: String,
    required: [true, "Please Enter Bank Name"],
  },
  holderName: {
    type: String,
    required: [true, "Please Enter Holder Name"],
  },
  ifscCode: {
    type: String,
    required: [true, "Please Enter IFSC Code"],
  },
  phone: {
    type: Number,
    required: [true, "Please Enter Phone Number"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Bank", BankMaster);
