const express = require("express");
const router = express.Router();
const {
  createBanner,
  getBanner,
  deleteBanners,
} = require("../../controllers/banner/index");

const verifyToken = require("../../../middleware/auth");
const upload = require("../../../middleware/imageUpload");

router.post("/create", verifyToken, upload.array("image"), createBanner);
router.get("/get", getBanner);
router.post("/delete", verifyToken, deleteBanners);

module.exports = router;
