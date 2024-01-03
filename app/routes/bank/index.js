const express = require("express");
const router = express.Router();

const verifyToken = require("../../../middleware/auth");
const { createBank, getAllBank, updateBank } = require("../../controllers/bank");


router.route("/create").post(verifyToken, createBank);

router.get("/getall-bank", verifyToken, getAllBank);
router.put("/edit/:id", verifyToken, updateBank);
module.exports = router;
