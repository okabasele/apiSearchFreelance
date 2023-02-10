const express = require("express");
const router = express.Router();
const missionController = require("../controllers/mission.controller");
const verifyIsCompany = require("../middlewares/verifyIsCompany");
const verifyIsFreelance = require("../middlewares/verifyIsFreelance");
const verifyToken = require("../middlewares/verifyToken");

router.get("/all", [verifyToken],missionController.getAllMissions);
router.post("/create", [verifyToken, verifyIsCompany],missionController.createMission);
router.get("/:id", [verifyToken, verifyIsCompany],missionController.getMission);
router.patch("/:id", [verifyToken, verifyIsCompany],missionController.updateMission);
router.delete("/:id", [verifyToken, verifyIsCompany],missionController.deleteMission);
router.patch("/:id/add-candidates", [verifyToken, verifyIsCompany],missionController.addCandidatesToMission);
router.patch("/:id/answer", [verifyToken, verifyIsFreelance],missionController.answerToMission);
router.patch("/:id/close", [verifyToken, verifyIsCompany],missionController.closeMission);

module.exports = router;
