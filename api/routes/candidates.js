const express = require("express");
const router = express.Router();
const candidateControllers = require("../controllers/candidates");
const fileHandler = require("../utils/fileHandler");

router.get(
  "/shortlisted-applicants",
  candidateControllers.getShortListedCandidates
);
router.get("/rejected-applicants", candidateControllers.getRejectedCandidates);
router.get(
  "/talentpool-applicants",
  candidateControllers.getTalentPooledCandidates
);
router.get(
  "/inprogress-applicants",
  candidateControllers.getInProgressCandidates
);
router.get("/", candidateControllers.getAllCandidates);
router.get("/status/:candidateID", candidateControllers.getCandidatesStatus);
router.get("/:candidateID", candidateControllers.getCandidatesAppliedJobs);
router.patch("/status", candidateControllers.ChangeApplicantStatus);
router.post(
  "/",
  fileHandler.file_Uploader.single("document"),
  candidateControllers.apply_for_Job
);

module.exports = router;

router.get("/records/pdf", candidateControllers.getAllCandidateInPDFForm);
