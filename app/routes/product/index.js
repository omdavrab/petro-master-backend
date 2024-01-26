const express = require("express");
const router = express.Router();

const verifyToken = require("../../../middleware/auth");
const { createProduct, getAllProduct, updateProduct } = require("../../controllers/product");

router.route("/create").post(verifyToken, createProduct);

router.get("/getall", verifyToken, getAllProduct);
router.put("/edit/:id", verifyToken, updateProduct);

module.exports = router;
