const express = require("express");
const router = express.Router();
const jobController = require("../controllers/job.controller");
const verifyToken = require("../middlewares/verifyToken");
const verifyIsAdmin = require("../middlewares/verifyIsAdmin");

router.get("/all",[verifyToken,verifyIsAdmin],jobController.getAllJobs);
router.get("/:id",[verifyToken,verifyIsAdmin],jobController.getJob);
router.post("/create",[verifyToken,verifyIsAdmin], jobController.createJob)
router.patch("/:id",[verifyToken, verifyIsAdmin],jobController.updateJob);
router.delete("/:id",[verifyToken, verifyIsAdmin],jobController.deleteJob);

module.exports = router;