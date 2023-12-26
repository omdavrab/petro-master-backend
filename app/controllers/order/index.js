const express = require("express");
const Order = require("../../models/Order");
const router = express.Router();


// Create a new order
const createOrder = async (req, res) => {
    try {
        const {
            totalPrice,
            restaurantId,
        } = req.body;
        const data = req.body
        const userId = req.user.id;
        // Validate request body
        if (!totalPrice || !restaurantId || !userId) {
            return res.status(400).json({ error: "Incomplete order information" });
        }
        // Find the last three orders for the same user
        const lastOrders = await Order.find(
            { userId },
            {},
            { sort: { createdAt: -1 } }
        );
        let totalSpent = totalPrice;
        if (lastOrders.length > 0) {
            const lastOrder = lastOrders[lastOrders.length - 1];
            totalSpent += lastOrder.totalSpent;
        }
        // Create a new order instance

        data.totalSpent = totalSpent
        data.lastOrderSpent = totalPrice
        data.userId = req.user.id
        const menuCreate = await new Order(data);
        menuCreate.save()
        return res
            .status(200)
            .send({ result: menuCreate, message: "Order placed successfully!" });

    } catch (error) {
        res.status(500).json({ message: "Failed to create the order" });
    }
};

// Get Order list
const getOrder = async (req, res) => {
    try {
        const query = {
            $and: [{ userId: req.user.id }, { restaurantId: req.user.restaurantID }],
        };
        const menuCreate = await Order.find(query).populate('menuList.menuId').sort({ _id: -1 }).exec();;
        return res.status(200).send(menuCreate);
    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
};

// Get Order list By Restaurant
const getOrderByRestaurant = async (req, res) => {
    try {
        const page = parseInt(req.query.page ? req.query.page : 1);
        const pageLimit = parseInt(req.query.pageLimit ? req.query.pageLimit : 10);
        // const limit = 10;
        const startIndex = (page - 1) * pageLimit;
        const endIndex = page * pageLimit;

        const query = { restaurantId: req.user.restaurantID }
        const result = await Order.find(query).populate('menuList.menuId').populate('userId').sort({ _id: -1 }).exec();;

        return res.status(200).send({
            data: result.slice(startIndex, endIndex),
            current: page,
            total: Math.ceil(result.length / pageLimit),
            results: result.length,
            startIndex: startIndex,
            endIndex: endIndex,
        });
    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
};





module.exports = {
    createOrder,
    getOrder,
    getOrderByRestaurant
};
