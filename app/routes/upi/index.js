const express = require("express");
const router = express.Router();

const verifyToken = require("../../../middleware/auth");
const { createUpi, getAllUpi, updateUpi } = require("../../controllers/upi");


router.route("/create").post(verifyToken, createUpi);

router.get("/getall-upi", verifyToken, getAllUpi);
router.put("/edit/:id", verifyToken, updateUpi);
module.exports = router;
