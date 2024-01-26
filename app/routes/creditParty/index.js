const express = require("express");
const router = express.Router();

const verifyToken = require("../../../middleware/auth");
const { createCreditParty, getAllCreditParty, updateCreditParty } = require("../../controllers/creditParty");

router.route("/create").post(verifyToken, createCreditParty);

router.get("/getall", verifyToken, getAllCreditParty);
router.put("/edit/:id", verifyToken, updateCreditParty);

module.exports = router;
