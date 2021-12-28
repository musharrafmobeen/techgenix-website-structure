const { sendEmail } = require("../utils/emailConfirmation");

exports.contactUs = async (req, res, next) => {
  try {
    let { name, email, subject, message } = req.body;
    message = "email : " + email + "\n" + message;
    await sendEmail(name, subject, message);
    res.status(200).json({ message: "Email Sent" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: {
        status: "Failed",
        statusCode: 500,
        errorMessage: err,
      },
      message: "Error occurred while trying to create a new Job.",
    });
  }
};
