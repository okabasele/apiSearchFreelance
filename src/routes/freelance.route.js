const express = require("express");
const router = express.Router();
const freelanceController = require("../controllers/freelance.controller");
const {
  checkEmail,
  checkIdentity,
  checkPassword,
  validation,
} = require("../middlewares/validators");

const verifyIsFreelance = require('../middlewares/verifyIsFreelance');
const verifyToken = require("../middlewares/verifyToken");

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
router.get("/:id",[verifyToken],freelanceController.getFreelance);
router.patch("/:id",[verifyToken, verifyIsFreelance],freelanceController.updateFreelance);
router.delete("/:id",[verifyToken, verifyIsFreelance],freelanceController.deleteFreelance);

module.exports = router;