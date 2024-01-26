const express = require("express");
const router = express.Router();

const verifyToken = require("../../../middleware/auth");
const {
  createRate,
  getAllRate,
  updateRate,
  getDateRate,
} = require("../../controllers/rate");

router.route("/create").post(verifyToken, createRate);

router.get("/getall-rate", verifyToken, getAllRate);
router.put("/edit/:id", verifyToken, updateRate);
router.get('/get', verifyToken, getDateRate)

module.exports = router;
