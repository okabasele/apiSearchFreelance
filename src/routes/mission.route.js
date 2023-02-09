const express = require("express");
const router = express.Router();
const missionController = require("../controllers/mission.controller");
const verifyIsCompany = require("../middlewares/verifyIsCompany");
const verifyToken = require("../middlewares/verifyToken");

router.post("/create", [verifyToken, verifyIsCompany],missionController.createMission);
router.patch("/:id/add-candidates", [verifyToken, verifyIsCompany],missionController.addCandidatesToMission);
router.patch("/:id/close", [verifyToken, verifyIsCompany],missionController.closeMission);

module.exports = router;
