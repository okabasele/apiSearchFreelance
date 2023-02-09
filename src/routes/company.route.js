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
const verifyToken = require("../middlewares/verifyToken");
const verifyIsCompany = require("../middlewares/verifyIsCompany");

router.post(
  "/register",
  checkEmail,
  checkSiret,
  checkIdentity,
  checkPassword,
  validation,
  companyController.register
);
router.get("/all",[verifyToken],companyController.getAllCompanies);
router.get("/:id",[verifyToken],companyController.getCompany);
router.patch("/:id",[verifyToken, verifyIsCompany],companyController.updateCompany);
router.delete("/:id",[verifyToken, verifyIsCompany],companyController.deleteCompany);

module.exports = router;