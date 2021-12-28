const express = require("express");
const router = express.Router();
const loginControllers = require("../controllers/login");

router.post("/", loginControllers.userlogin);

module.exports = router;
