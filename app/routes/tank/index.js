const express = require("express");
const router = express.Router();

const verifyToken = require("../../../middleware/auth");
const upload = require("../../../middleware/imageUpload");
const {
  createTank,
  getAllTank,
  updateTank,
} = require("../../controllers/tank");

router.route("/create").post(verifyToken, createTank);

router.get("/getall-tank", verifyToken, getAllTank);
router.put("/edit/:id", verifyToken, updateTank);
module.exports = router;
