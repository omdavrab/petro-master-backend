const express = require("express");
const router = express.Router();

const verifyToken = require("../../../middleware/auth");
const { createShift, getAllShift, updateShift } = require("../../controllers/shift");


router.route("/create").post(verifyToken, createShift);

router.get("/getall-shift", verifyToken, getAllShift);
router.put("/edit/:id", verifyToken, updateShift);
module.exports = router;
