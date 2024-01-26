const mongoose = require("mongoose");

const vehicle = new mongoose.Schema({
  type: {
    type: String,
    required: [true, "Please Enter Vehicle Type"],
  },
  vnumber: {
    type: String,
    required: [true, "Please Enter Vehicle Number"],
  },
});

const CreditPartySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide user ID,"],
  },
  name: {
    type: String,
    required: [true, "Please Enter Name"],
  },
  phone: {
    type: String,
    required: [true, "Please Enter Phone"],
  },
  address: {
    type: String,
    required: [true, "Please Enter Email"],
  },
  vehicle: [vehicle],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const CreditParty = mongoose.model("CreditParty", CreditPartySchema);

module.exports = CreditParty;
