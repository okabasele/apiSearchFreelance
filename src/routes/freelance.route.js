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

module.exports = router;