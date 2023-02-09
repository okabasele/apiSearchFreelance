const express = require("express");
const router = express.Router();
const freelanceController = require("../controllers/freelance.controller");
const {
  checkEmail,
  checkIdentity,
  checkPassword,
  validation,
} = require("../middlewares/validators");

router.post(
  "/register",
  checkEmail,
  checkIdentity,
  checkPassword,
  validation,
  freelanceController.register
);

router.get("/all",freelanceController.getAllFreelances);
router.post("/filter",freelanceController.filterFreelances);

module.exports = router;