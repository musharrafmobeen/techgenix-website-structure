const mongoose = require("mongoose");

const candidateStatus = [
  "shortlisted",
  "rejected",
  "talentpool",
  "inProgress",
  "hidden",
];

const candidateSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    jobID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Jobs",
    },
    candidateID: { type: String, required: true },
    email: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    documentUrl: { type: String },
    status: { type: String, enum: candidateStatus },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Candidates", candidateSchema);
