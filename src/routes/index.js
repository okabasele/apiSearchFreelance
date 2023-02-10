const express = require("express");
const router = express.Router();
const authRouter = require('./auth.route')
const freelanceRouter = require('./freelance.route')
const companyRouter = require('./company.route')
const missionRouter = require('./mission.route')
const skillRouter = require('./skill.route')
const jobRouter = require('./job.route')

router.use("/auth",authRouter);
router.use("/freelance",freelanceRouter);
router.use("/company",companyRouter);
router.use("/mission",missionRouter);
router.use("/skill",skillRouter);
router.use("/job",jobRouter);

module.exports = router;