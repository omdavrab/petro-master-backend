const express = require("express");
const router = express.Router();

const verifyToken = require("../../../middleware/auth");
const {
  createRate,
  getAllRate,
  updateRate,
} = require("../../controllers/rate");

router.route("/create").post(verifyToken, createRate);

router.get("/getall-rate", verifyToken, getAllRate);
router.put("/edit/:id", verifyToken, updateRate);

module.exports = router;
