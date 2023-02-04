const express = require("express");
const router = express.Router();
const authRouter = require('./auth.route')
const freelanceRouter = require('./freelance.route')

router.use("/auth",authRouter);
router.use("/freelance",freelanceRouter);

module.exports = router;