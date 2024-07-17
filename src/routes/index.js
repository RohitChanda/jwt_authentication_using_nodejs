const userRouters = require("./user");
const express = require('express');
const router = express.Router();

router.use(userRouters);

module.exports = router;