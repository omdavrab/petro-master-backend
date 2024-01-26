const express = require("express");
const {
    createOrder, getOrder, getOrderByRestaurant
} = require("../../controllers/order");
const upload = require("../../../middleware/imageUpload");
const verifyToken = require("../../../middleware/auth");
const router = express.Router();

router.post("/create", verifyToken, createOrder);
router.get("/get", verifyToken, getOrder)
router.get('/get/restaurant', verifyToken, getOrderByRestaurant)


module.exports = router;
