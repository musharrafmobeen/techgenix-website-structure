const express = require("express");
const router = express.Router();
const emailControllers = require("../controllers/contact");

router.post("/", emailControllers.contactUs);

module.exports = router;
