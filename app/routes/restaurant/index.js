const express = require("express");
const router = express.Router();
const upload = require("../../../middleware/imageUpload");
const verifyToken = require("../../../middleware/auth");

const {
  createRestaurant,
  getRestaurant,
  EditRestaurant,
  getCustomersData,
  getTotalByRestaurant,
  getTrendingItems,
} = require("../../controllers/restaurant");

router.post("/register", verifyToken, upload.single("image"), createRestaurant);
router.get("/get/restaurant", verifyToken, getRestaurant);
router.put("/edit", verifyToken, upload.single("image"), EditRestaurant);
router.get("/get/customers", verifyToken, getCustomersData);
router.get("/get/total", verifyToken, getTotalByRestaurant);
router.get("/get/trendingitems", getTrendingItems);

module.exports = router;
