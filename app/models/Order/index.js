const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        unique: true,
    },
    totalPrice: {
        type: Number,
        required: [true, "Total Price is required"],
    },
    totalQty: {
        type: Number,
        required: [true, "Total QTY is required"],
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
    number: {
        type: Number
    },
    status: {
        type: String,
        enum: ["Pending", "Complete", "Cancel"],
        default: "Pending"
    },
    tableNum: {
        type: Number,
        required: [true, "Please provide Table number,"],

    },
    menuList: [
        {
            menuId: {
                type: mongoose.Types.ObjectId,
                ref: "Menu",
                required: [true, "Please provide menu Id,"]
            },
            QTY: {
                type: Number,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            Instructions: {
                Instructions: {
                    type: String
                },
                customizeItem: [{
                    type: String
                }]
            }
        }
    ],
    paymentMethod: {
        type: String,
        required: [true, "Please provide payment method,"],
    },
    totalSpent: {
        type: Number,
        default: 0,
        validate: {
            validator: Number.isFinite,
        },
    },
    userData: { type: mongoose.Schema.Types.Mixed },
    lastOrderSpent: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Pre-save hook to generate unique orderId
orderSchema.pre("save", async function (next) {
    if (!this.orderId) {
        const lastOrder = await this.constructor.findOne({}, {}, { sort: { orderId: -1 } }).exec();
        const lastOrderId = lastOrder ? parseInt(lastOrder.orderId) : 100;
        this.orderId = (lastOrderId + 1).toString().padStart(3, "0");
    }
    next();
});

module.exports = mongoose.model("Order", orderSchema);
