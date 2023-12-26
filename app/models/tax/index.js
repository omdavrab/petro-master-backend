const mongoose = require('mongoose')


const TaxSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide restaurant name"],
    },
    value: {
        type: Number,
        required: [true, "Please provide address"],
    },
    status: {
        type: Boolean,
        default: true
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
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("tax", TaxSchema);