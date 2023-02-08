const express = require("express");
const router = express.Router();
const missionController = require("../controllers/mission.controller");
const verifyIsCompany = require("../middlewares/verifyIsCompany");
const verifyToken = require("../middlewares/verifyToken");

router.post("/create", [verifyToken, verifyIsCompany],missionController.createMission);

module.exports = router;
