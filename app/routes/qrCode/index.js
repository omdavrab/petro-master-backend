const express = require("express");
const verifyToken = require("../../../middleware/auth");
const { createQRCode, getQRCode, deleteQR } = require("../../controllers/qrcode");
const router = express.Router();

router.post("/create", verifyToken, createQRCode);
router.get('/get', verifyToken, getQRCode)
router.delete('/delete/:id', verifyToken, deleteQR)

module.exports = router;
