const express = require("express");
const router = express.Router();
const { createTax, getTax, EditTax, deleteTax } = require("../../controllers/tax/index");

const verifyToken = require("../../../middleware/auth");

router.post("/create", verifyToken, createTax);
router.get("/get", verifyToken, getTax)
router.put('/edit/:id', verifyToken, EditTax)
router.delete('/delete/:id', verifyToken, deleteTax)


module.exports = router;

