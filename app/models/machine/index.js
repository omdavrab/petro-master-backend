const mongoose = require("mongoose");

const MachineMaster = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide user ID,"],
  },
  name: {
    type: String,
    required: [true, "Please Enter Machine Name"],
  },
  type: {
    type: String,
    required: [true, "Please Enter Machine Type"],
    enum: ["DU", "MDU"],
    default: "DU",
  },
  nozzles: [
    {
      tank: {
        type: String,
        required: [true, "Please Enter Tank Name"],
      },
      tankId: {
        type: mongoose.Schema.ObjectId,
        ref: "Tank",
        required: [true, "Please Select Tank"],
      },
      nozzle: {
        type: String,
        required: [true, "Please Enter Nozzle Name"],
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Machine", MachineMaster);
