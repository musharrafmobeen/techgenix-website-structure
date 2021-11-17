const scheduledMeetingsModel = require("../models/scheduledMeetings");

exports.create_Meeting = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_ADMIN_KEY);

    if (decoded) {
      const data = req.body.map((obj) => {
        return {
          _id: new mongoose.Types.ObjectId(),
          Subject: obj.Subject,
          Description: obj.Description,
          StartTime: obj.StartTime,
          EndTime: obj.EndTime,
          StartTimezone: obj.StartTimezone,
          EndTimezone: obj.EndTimezone,
          Location: obj.Location,
          Id: obj.Id,
          RecurrenceID: obj.RecurrenceID,
          Guid: obj.Guid,
          IsAllDay: obj.IsAllDay,
          RecurrenceRule: obj.RecurrenceRule,
        };
      });

      const scheduledMeeting = new scheduledMeetingsModel({
        _id: new mongoose.Types.ObjectId(),
        Subject: req.body.Subject,
        Description: req.body.Description,
        StartTime: req.body.StartTime,
        EndTime: req.body.EndTime,
        StartTimezone: req.body.StartTimezone,
        EndTimezone: req.body.EndTimezone,
        Location: req.body.Location,
        Id: req.body.Id,
        RecurrenceID: req.body.RecurrenceID,
        Guid: req.body.Guid,
        IsAllDay: req.body.IsAllDay,
        RecurrenceRule: req.body.RecurrenceRule,
      });

      const createdScheduledMeeting = await scheduledMeeting.save();

      return res.status(201).json({
        message: "Meeting Created",
        createdJob: {
          _id: createdScheduledMeeting._id,
          Subject: createdScheduledMeeting.Subject,
          Description: createdScheduledMeeting.Description,
          StartTime: createdScheduledMeeting.StartTime,
          EndTime: createdScheduledMeeting.EndTime,
          StartTimezone: createdScheduledMeeting.StartTimezone,
          EndTimezone: createdScheduledMeeting.EndTimezone,
          Location: createdScheduledMeeting.Location,
          Id: createdScheduledMeeting.Id,
          RecurrenceID: createdScheduledMeeting.RecurrenceID,
          Guid: createdScheduledMeeting.Guid,
          IsAllDay: createdScheduledMeeting.IsAllDay,
          RecurrenceRule: createdScheduledMeeting.RecurrenceRule,
          request: {
            type: "POST",
            URL: "http://localhost:5000/scheduleMeeting/",
          },
        },
      });
    }
    return res.status(401).json({
      status: 401,
      message: "Auth Failed",
      error: "User Is not authorized to create Meetings",
    });
  } catch (err) {
    return res.status(500).json({
      error: {
        status: "Failed",
        statusCode: 500,
        errorMessage: err,
      },
      message: "Error occured while trying to create a Meeting.",
    });
  }
};

exports.get_All_Meetings = async (req, res, next) => {
  try {
    const scheduledMeetings = await scheduledMeetingsModel.find().exec();
    return res.status(200).json({
      message: "All Jobs Returned",
      scheduledMeetings: scheduledMeetings[-1],
      request: {
        type: "GET",
        URL: "http://localhost:5000/scheduleMeeting/",
      },
    });
  } catch (err) {
    return res.status(500).json({
      error: {
        status: "Failed",
        statusCode: 500,
        errorMessage: err,
      },
      message: "Error occured while trying to get all Meetings.",
    });
  }
};
