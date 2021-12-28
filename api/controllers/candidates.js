const candidateModel = require("../models/candidates");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const fs = require("fs");
const PDFDocument = require("pdfkit-table");
const { promisify } = require("util");
const { join } = require("path");
const mv = promisify(fs.rename);

exports.apply_for_Job = async (req, res, next) => {
  try {
    console.log(req.body);
    const { candidateID, name, email, phone, jobID } = req.body;

    const candidateCheckAndUpdate = await candidateModel
      .findOneAndUpdate(
        { email, jobID },
        { $set: { ...req.body, documentUrl: req.file.path } }
      )
      .exec();

    if (!candidateCheckAndUpdate) {
      const candidate = new candidateModel({
        _id: new mongoose.Types.ObjectId(),
        candidateID,
        jobID,
        name,
        email,
        phone,
        status: "inProgress",
        documentUrl: req.file.path,
      });
      console.log(name, email);
      const newCandidate = await candidate.save();

      return res.status(201).json({
        message: "Applied For Job",
        applicant: {
          _id: newCandidate._id,
          candidateID: newCandidate.candidateID,
          name: newCandidate.name,
          email: newCandidate.email,
          phone: newCandidate.phone,
          documentUrl: newCandidate.documentUrl,
          request: {
            type: "POST",
            URL: "http://localhost:5000/jobApplication/",
          },
        },
      });
    }
    return res.status(201).json({
      message: "Application Updated",
      applicant: {
        _id: candidateCheckAndUpdate._id,
        candidateID: candidateCheckAndUpdate.candidateID,
        name: candidateCheckAndUpdate.name,
        email: candidateCheckAndUpdate.email,
        phone: candidateCheckAndUpdate.phone,
        documentUrl: candidateCheckAndUpdate.documentUrl,
        request: {
          type: "POST",
          URL: "http://localhost:5000/jobApplication/",
        },
      },
    });
  } catch (err) {
    return res.status(500).json({
      error: {
        status: "Failed",
        statusCode: 500,
        errorMessage: err,
      },
      message: "Error occured while trying to apply for a Job.",
    });
  }
};

exports.getCandidatesStatus = async (req, res, next) => {
  try {
    const { candidateID } = req.params;
    const jobStatusResult = await candidateModel
      .find({ candidateID })
      .select("jobID status")
      .exec();

    let jobsStatus = {};
    for (let i = 0; i < jobStatusResult.length; i++) {
      if (!jobsStatus.hasOwnProperty(jobStatusResult[i]["jobID"])) {
        jobsStatus[jobStatusResult[i]["jobID"]] = jobStatusResult[i]["status"];
      }
    }

    return res.status(201).json({
      message: "A candidates applied jobs annd their statuses",
      jobsStatus,
      request: {
        type: "GET",
        URL: "http://localhost:5000/jobApplication/status",
      },
    });
  } catch (err) {
    return res.status(500).json({
      error: {
        status: "Failed",
        statusCode: 500,
        errorMessage: err,
      },
      message:
        "Error occured while trying to get the statuses of a candidates applied jobs.",
    });
  }
};

exports.ChangeApplicantStatus = async (req, res, next) => {
  try {
    const { status, jobID, candidateID } = req.body;

    await candidateModel
      .updateMany({ candidateID, jobID }, { $set: { status } })
      .exec();

    return res.status(200).json({
      message: "Applicants Status Changed",
      updatedApplicants: await candidateModel.find().exec(),
      request: {
        type: "PATCH",
        URL: "http://localhost:5000/jobApplication/status",
      },
    });
  } catch (err) {
    return res.status(500).json({
      error: {
        status: "Failed",
        statusCode: 500,
        errorMessage: err,
      },
      message: "Error occured while trying to change status of an applicant.",
    });
  }
};

exports.getAllCandidates = async (req, res, next) => {
  try {
    const candidates = await candidateModel.find().populate("jobID").exec();
    return res.status(200).json({
      message: "All Applicants Returned",
      candidates,
      request: {
        type: "GET",
        URL: "http://localhost:5000/jobApplication/",
      },
    });
  } catch (err) {
    return res.status(500).json({
      error: {
        status: "Failed",
        statusCode: 500,
        errorMessage: err,
      },
      message: "Error occured while trying to get all applicants.",
    });
  }
};

exports.getCandidatesCountByJob = async (req, res, next) => {
  try {
    const candidates = await candidateModel.find().populate("jobID").exec();
    let cand = {};
    for (let i = 0; i < candidates.length; i++) {
      if (cand.hasOwnProperty(`${candidates[i].jobID._id}`)) {
        cand[`${candidates[i].jobID._id}`].candidates.push(candidates[i]);
      } else {
        cand[`${candidates[i].jobID._id}`] = {
          jobId: candidates[i].jobID._id,
          jobName: candidates[i].jobID.name,
          jobDescription: candidates[i].jobID.description,
          candidates: [candidates[i]],
        };
      }
    }
    return res.status(200).json({
      message: "All CandidatesCountByJob Returned",
      candidates: cand,
      request: {
        type: "GET",
        URL: "http://localhost:5000/jobApplication/ByJob",
      },
    });
  } catch (err) {
    return res.status(500).json({
      error: {
        status: "Failed",
        statusCode: 500,
        errorMessage: err,
      },
      message: "Error occured while trying to get all applicants.",
    });
  }
};

exports.getCandidatesByJob = async (req, res, next) => {
  try {
    const candidates = await candidateModel
      .find({ jobID: req.params.JobID })
      .exec();
    // let cand = {};
    // for (let i = 0; i < candidates.length; i++) {
    //   if (cand.hasOwnProperty(`${candidates[i].jobID._id}`)) {
    //     cand[`${candidates[i].jobID._id}`].candidates.push(candidates[i]);
    //   } else {
    //     cand[`${candidates[i].jobID._id}`] = {
    //       jobId: candidates[i].jobID._id,
    //       jobName: candidates[i].jobID.name,
    //       jobDescription: candidates[i].jobID.description,
    //       candidates: [candidates[i]],
    //     };
    //   }
    // }
    return res.status(200).json({
      message: "All Candidates By Job Returned",
      candidates,
      request: {
        type: "GET",
        URL: "http://localhost:5000/jobApplication/ByJob/:jobID",
      },
    });
  } catch (err) {
    return res.status(500).json({
      error: {
        status: "Failed",
        statusCode: 500,
        errorMessage: err,
      },
      message: "Error occured while trying to get all applicants.",
    });
  }
};

exports.getShortListedCandidates = async (req, res, next) => {
  try {
    const candidates = await candidateModel
      .find({ status: "shortlisted" })
      .exec();
    return res.status(200).json({
      message: "ShortListed Applicants Returned",
      candidates,
      request: {
        type: "GET",
        URL: "http://localhost:5000/jobApplication/shortlisted-applicants",
      },
    });
  } catch (err) {
    return res.status(500).json({
      error: {
        status: "Failed",
        statusCode: 500,
        errorMessage: err,
      },
      message: "Error occured while trying to get shortlisted applicants.",
    });
  }
};

exports.getRejectedCandidates = async (req, res, next) => {
  try {
    const candidates = await candidateModel.find({ status: "rejected" }).exec();
    return res.status(201).json({
      message: "Rejected Applicants Returned",
      candidates,
      request: {
        type: "GET",
        URL: "http://localhost:5000/jobApplication/rejected-applicants",
      },
    });
  } catch (err) {
    return res.status(500).json({
      error: {
        status: "Failed",
        statusCode: 500,
        errorMessage: err,
      },
      message: "Error occured while trying to get rejected applicants.",
    });
  }
};

exports.getTalentPooledCandidates = async (req, res, next) => {
  try {
    const candidates = await candidateModel
      .find({ status: "talentpool" })
      .exec();
    return res.status(201).json({
      message: "TalentPool Applicants Returned",
      candidates,
      request: {
        type: "GET",
        URL: "http://localhost:5000/jobApplication/talentpool-applicants",
      },
    });
  } catch (err) {
    return res.status(500).json({
      error: {
        status: "Failed",
        statusCode: 500,
        errorMessage: err,
      },
      message: "Error occured while trying to get talentpool applicants.",
    });
  }
};

exports.getInProgressCandidates = async (req, res, next) => {
  try {
    const candidates = await candidateModel
      .find({ status: "inProgress" })
      .exec();
    return res.status(201).json({
      message: "In Progress Applicants Returned",
      candidates,
      request: {
        type: "GET",
        URL: "http://localhost:5000/jobApplication/inprogress-applicants",
      },
    });
  } catch (err) {
    return res.status(500).json({
      error: {
        status: "Failed",
        statusCode: 500,
        errorMessage: err,
      },
      message: "Error occured while trying to get in progress applicants.",
    });
  }
};

exports.getCandidatesAppliedJobs = async (req, res, next) => {
  try {
    const { candidateID } = req.params;
    const jobID = await candidateModel
      .find({ candidateID })
      .select("jobID")
      .exec();

    let jobIdCounts = {};
    for (let i = 0; i < jobID.length; i++) {
      if (jobIdCounts.hasOwnProperty(jobID[i]["jobID"])) {
        jobIdCounts[jobID[i]["jobID"]] = jobIdCounts[jobID[i]["jobID"]] + 1;
      } else {
        jobIdCounts[jobID[i]["jobID"]] = 1;
      }
    }

    return res.status(200).json({
      message: "Candidate's Applied For Jobs Returned",
      appliedForJobs: jobIdCounts,
      request: {
        type: "GET",
        URL: "http://localhost:5000/jobApplication/:candidateID",
      },
    });
  } catch (err) {
    return res.status(500).json({
      error: {
        status: "Failed",
        statusCode: 500,
        errorMessage: err,
      },
      message:
        "Error occured while trying to get all the jobs a candidate has applied for.",
    });
  }
};

exports.getAllCandidateInPDFForm = async (req, res, next) => {
  try {
    const doc = new PDFDocument({ margin: 30, size: "A4" });
    doc.pipe(fs.createWriteStream("./records.pdf"));

    const candidates = await candidateModel.find().exec();

    const shortListedCandidates = await candidateModel
      .find({ status: "shortlisted" })
      .exec();

    const rejectedCandidates = await candidateModel
      .find({ status: "rejected" })
      .exec();

    const talentPooledCandidates = await candidateModel
      .find({ status: "talentpool" })
      .exec();

    const inProgressCandidates = await candidateModel
      .find({ status: "inProgress" })
      .exec();

    let rows = [];

    for (let i = 0; i < candidates.length; i++) {
      if (!shortListedCandidates[i]) {
        shortListedCandidates[i] = { name: " " };
      }
      if (!rejectedCandidates[i]) {
        rejectedCandidates[i] = { name: " " };
      }
      if (!talentPooledCandidates[i]) {
        talentPooledCandidates[i] = { name: " " };
      }
      if (!inProgressCandidates[i]) {
        inProgressCandidates[i] = { name: " " };
      }

      rows.push([
        candidates[i].name,
        shortListedCandidates[i].name,
        rejectedCandidates[i].name,
        talentPooledCandidates[i].name,
        inProgressCandidates[i].name,
      ]);
    }

    const table = {
      title: "Candidate Records",
      headers: [
        "All Candidates",
        "ShortListed",
        "Rejected",
        "TalentPooled",
        "In-Progress",
      ],
      rows,
    };
    doc.table(table, {
      width: 300,
    });

    doc.end();

    let dir = __dirname.split("\\");
    dir = dir.splice(0, dir.length - 2);
    dir = dir.join("\\");

    const original = join(dir, "/records.pdf");
    const target = join(dir, "/uploads/records.pdf");
    await mv(original, target);

    return res.status(200).json({
      message: "Records For The Applied Jobs In a PDF Format.",
      document_url: "/uploads/records.pdf",
      request: {
        type: "GET",
        URL: "http://localhost:5000/jobApplication/",
      },
    });
  } catch (err) {
    return res.status(500).json({
      error: {
        status: "Failed",
        statusCode: 500,
        errorMessage: err,
      },
      message:
        "Error occured while trying to crate a pdf file for all the applied for job's records.",
    });
  }
};
