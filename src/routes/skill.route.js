const express = require("express");
const router = express.Router();
const skillController = require("../controllers/skill.controller");
const verifyToken = require("../middlewares/verifyToken");
const verifyIsAdmin = require("../middlewares/verifyIsAdmin");

router.get("/all",[verifyToken,verifyIsAdmin],skillController.getAllSkills);
router.get("/:id",[verifyToken,verifyIsAdmin],skillController.getSkill);
router.patch("/:id",[verifyToken, verifyIsAdmin],skillController.updateSkill);
router.delete("/:id",[verifyToken, verifyIsAdmin],skillController.deleteSkill);

module.exports = router;