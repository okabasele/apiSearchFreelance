const express = require("express");
const router = express.Router();
const authRouter = require('./auth.route')
const freelanceRouter = require('./freelance.route')
const companyRouter = require('./company.route')
const missionRouter = require('./mission.route')
const skillRouter = require('./skill.route')
const jobRouter = require('./job.route')
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../../swagger-output.json');

router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument));
router.use("/auth",authRouter);
router.use("/freelance",freelanceRouter);
router.use("/company",companyRouter);
router.use("/mission",missionRouter);
router.use("/skill",skillRouter);
router.use("/job",jobRouter);

module.exports = router;