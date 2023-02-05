const express = require("express");
const router = express.Router();
const companyController = require("../controllers/company.controller");
const {
  checkEmail,
  checkSiret,
  checkIdentity,
  checkPassword,
  validation,
} = require("../middlewares/validators");

router.post(
  "/register",
  checkEmail,
  checkSiret,
  checkIdentity,
  checkPassword,
  validation,
  companyController.register
);

module.exports = router;