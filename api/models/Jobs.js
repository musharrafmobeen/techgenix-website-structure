const mongoose = require("mongoose");

const jobsSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    detail: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Jobs", jobsSchema);
