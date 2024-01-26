const mongoose = require("mongoose")

const TankMaster = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: [true, "Please provide user ID,"],
      },
    name: {
        type: String,
        required: [true, "Please Enter Tank Name"],
    },
    capacity: {
        type: Number,
        required: [true, "Please Enter Tank Capacity"],
    },
    unit: {
        type: String,
        required: [true, "Please Enter Unit"],
    },
    type: {
        type: String,
        required: [true, "Please Enter Your Address"],
        enum: ["MS", "HSD"],
        default: "MS",
    },
    depth: {
        type: Number,
        required: [true, "Please Enter Tank Depth"],
    },
    length: {
        type: Number,
        required: [true, "Please Enter Tank Length"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model("Tank", TankMaster)