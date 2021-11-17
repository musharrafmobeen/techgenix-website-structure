const nodemailer = require("nodemailer");
const randomString = require("./randomString");

const sendEmailConfirmation = async (email, subject, text) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "musharrafmobeen24@gmail.com",
      pass: process.env.Mongo_db_Atlas_PW,
    },
  });

  var mailOptions = {
    from: "TechGenix",
    to: email,
    subject: subject,
    text: text,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

const emailVerification = async (email, verificationId) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "musharrafmobeen24@gmail.com",
      pass: "Blackviking125",
    },
  });

  let stringVerificationId = randomString(100);

  var mailOptions = {
    from: "TechGenix",
    to: email,
    subject: "Email Verification",
    html: `<p>Click Here To Verify Email <a href="http://localhost:5000/users/verifyUser/${verificationId}"> ${stringVerificationId} </a></p>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

const emailUpdatePassword = async (email) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "musharrafmobeen24@gmail.com",
      pass: "Blackviking125",
    },
  });

  let stringVerificationId = randomString(100);

  var mailOptions = {
    from: "Ineffable",
    to: email,
    subject: "Email Verification",
    html: `<p>Click Here To Update Password <a href="http://localhost:5000/forgotPassword/${email}"> ${stringVerificationId} </a></p>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = {
  sendEmailConfirmation,
  emailVerification,
  emailUpdatePassword,
};
