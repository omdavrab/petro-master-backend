const express = require("express");
const router = express.Router();

const verifyToken = require("../../../middleware/auth");
const upload = require("../../../middleware/imageUpload");
const {
  createEmployee,
  getAllEmployeesByUserId,
  updateEmployee,
} = require("../../controllers/employee");

router
  .route("/create-employee")
  .post(
    verifyToken,
    upload.fields([{ name: "front" }, { name: "back" }]),
    createEmployee
  );

router.get("/getall-employee", verifyToken, getAllEmployeesByUserId);
router.put(
  "/edit/:id",
  verifyToken,
  upload.fields([{ name: "front" }, { name: "back" }]),
  updateEmployee
);
module.exports = router;
