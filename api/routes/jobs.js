const express = require("express");
const router = express.Router();
const jobControllers = require("../controllers/jobs");

router.get("/", jobControllers.get_All_Jobs);
router.get("/jobCount", jobControllers.get_JobCounts_By_Category);
router.get("/byCategory/:category", jobControllers.get_Jobs_By_Category);
router.get("/:jobID", jobControllers.get_Specific_Job);
router.post("/", jobControllers.create_Job);
router.patch("/:jobID", jobControllers.update_Job);
router.delete("/:jobID", jobControllers.delete_Job);

module.exports = router;
