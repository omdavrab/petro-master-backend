const express = require("express");
const {
  createMenu,
  deleteMenu,
  editMenu,
  getMenus,
  getMenuById,
  // getMenuByCategory,
} = require("../../controllers/menu");
const upload = require("../../../middleware/imageUpload");
const verifyToken = require("../../../middleware/auth");
const router = express.Router();

router.post("/create", verifyToken, upload.single("image"), createMenu);
router.delete("/delete/:id", verifyToken, deleteMenu);
router.put("/edit/:id", verifyToken, upload.single("image"), editMenu);
router.get("/get", verifyToken, getMenus);
router.get("/getId/:id", verifyToken, getMenuById);

module.exports = router;
