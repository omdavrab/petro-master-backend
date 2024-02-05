const express = require("express");
const router = express.Router();

const verifyToken = require("../../../middleware/auth");
const { GetCollection, createCollection, GetReport } = require("../../controllers/dailyReport");


router.route("/create").post(verifyToken, createCollection);

router.post("/getall", verifyToken, GetCollection);

router.get('/',verifyToken, GetReport)

module.exports = router;
