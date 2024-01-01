const express = require("express");
const router = express.Router();
const verifyToken = require("../../../middleware/auth");
const upload = require("../../../middleware/imageUpload");

const {
  register,
  login,
  verifyOtp,
  forgotPassword,
  verifyForgotPasswordOtp,
  updateForgotPassword,
  updateUser,
} = require("../../controllers/auth");

router.post("/register",upload.single("image"), register);
router.post("/login", login);
router.post("/verify", verifyOtp);
router.post("/forgotPassword", forgotPassword);
router.post("/verifyForgotPassword", verifyForgotPasswordOtp);
router.post("/updatePassword", updateForgotPassword);
router.put("/edit/user", verifyToken, updateUser);
module.exports = router;
