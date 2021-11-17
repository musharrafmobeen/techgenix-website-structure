const mongoose = require("mongoose");

const scheduledMeetingsSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    Subject: { type: String, required: true },
    Description: { type: String },
    StartTime: { type: Date },
    EndTime: { type: Date },
    StartTimezone: { type: String },
    EndTimezone: { type: String },
    Location: { type: String },
    Id: { type: Number },
    RecurrenceID: { type: Number },
    Guid: { type: String },
    IsAllDay: { type: Boolean },
    RecurrenceRule: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("scheduledMeetings", scheduledMeetingsSchema);
