const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/users");

router.post("/register", userControllers.registerUser);
router.get("/verifyUser/:verificationId", userControllers.verifyUser);
router.post("/login", userControllers.userLogIn);
// router.get("/:jobID", jobControllers.get_Specific_Job);
// router.post("/", jobControllers.create_Job);
// router.patch("/:jobID", jobControllers.update_Job);
// router.delete("/:jobID", jobControllers.delete_Job);

module.exports = router;
