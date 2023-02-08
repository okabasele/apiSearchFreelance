const express = require("express");
const router = express.Router();
const authRouter = require('./auth.route')
const freelanceRouter = require('./freelance.route')
const companyRouter = require('./company.route')
const missionRouter = require('./mission.route')

router.use("/auth",authRouter);
router.use("/freelance",freelanceRouter);
router.use("/company",companyRouter);
router.use("/mission",missionRouter);

module.exports = router;