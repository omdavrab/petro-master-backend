const express = require("express");
const router = express.Router();
const {
  createFoodCategory,
  editFoodCategory,
  deleteFoodCategory,
  getFoodCategories,
  getFoodCategory,
  getMenuByCategory,
  getFoodCategoryByRestaurant,
} = require("../../controllers/foodCategory");
const verifyToken = require("../../../middleware/auth");
const upload = require("../../../middleware/imageUpload");

router.post("/create", verifyToken, upload.single("image"), createFoodCategory);
router.put("/edit/:id", verifyToken, upload.single("image"), editFoodCategory);
router.delete("/delete/:id", verifyToken, deleteFoodCategory);
router.get("/get", verifyToken, getFoodCategories);
router.get("/getId/:id", verifyToken, getFoodCategory);
router.get("/get/menu/:id", getMenuByCategory);
router.get("/getcategorybyrestaurant/:id", getFoodCategoryByRestaurant);

module.exports = router;
