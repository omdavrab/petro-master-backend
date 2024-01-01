const express = require("express");
const router = express.Router();

const verifyToken = require("../../../middleware/auth");

const {
  createMachine,
  getAllMachine,
  updateMachine,
} = require("../../controllers/machine");

router.route("/create").post(verifyToken, createMachine);

router.get("/getall-machine", verifyToken, getAllMachine);
router.put("/edit/:id", verifyToken, updateMachine);

module.exports = router;
