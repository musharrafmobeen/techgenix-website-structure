const {
  sendEmailConfirmation,
  emailVerification,
  emailUpdatePassword,
} = require("../utils/emailConfirmation");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/users");
const unVerifiedUsersModel = require("../models/unVerifiedUsers");
const mongoose = require("mongoose");

exports.registerUser = async (req, res, next) => {
  try {
    let verificationId = uuidv4();
    const { email, name, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      bcrypt.hash(password, 10, async (err, password) => {
        if (err) {
          return res.status(500).json({
            error: {
              status: "Failed",
              statusCode: 500,
              errorMessage: err,
            },
            message: "Error occured while Registering a User.",
          });
        } else {
          const user = new unVerifiedUsersModel({
            _id: new mongoose.Types.ObjectId(),
            email,
            name,
            password,
            verificationId,
          });

          await user.save();
        }
      });
      emailVerification(email, verificationId);
      return res.status(200).json({
        message: "user verification email sent. click on link to verify.",
        request: {
          type: "POST",
          description: "Register User",
          URL: "http://localhost:5000/users/signup",
        },
      });
    }
    return res.status(401).json({
      error: {
        status: "User Already Present",
        statusCode: 401,
      },
      message: "User Has Already Been Registered.",
    });
  } catch (error) {
    return res.status(500).json({
      error: {
        status: "Failed",
        statusCode: 500,
        errorMessage: err,
      },
      message: "Error occured while Registering a User.",
    });
  }
};

exports.verifyUser = async (req, res, next) => {
  try {
    const { verificationId } = req.params;
    const user = await unVerifiedUsersModel.findOneAndDelete({
      verificationId,
    });
    if (user) {
      const { email, name, password } = user;
      const newUser = new userModel({
        _id: new mongoose.Types.ObjectId(),
        email,
        name,
        password,
      });
      await newUser.save();

      sendEmailConfirmation(
        email,
        "New User",
        "Your Account Has Been Registered"
      );
      return res.status(201).json({
        message: "User Account Created",
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          request: {
            type: "GET",
            URL: "http://localhost:5000/users/verifyUser/:verificationId",
          },
        },
      });
    } else {
      return res.status(404).json({
        message: "No User Found",
        request: {
          type: "GET",
          URL: "http://localhost:5000/users/verifyUser/:verificationId",
        },
      });
    }
  } catch (err) {
    return res.status(500).json({
      error: {
        status: "Failed",
        statusCode: 500,
        errorMessage: err,
      },
      message: "Error occured while Creating User Account.",
    });
  }
};

exports.userLogIn = async (req, res, next) => {
  try {
    let userDoc = await userModel
      .findOne({ email: req.body.email })
      .select("name email _id password")
      .exec();

    if (adminDoc) {
      bcrypt.compare(req.body.password, userDoc.password, (err, result) => {
        if (err) {
          return res.status(401).json({
            error: {
              status: "Auth Failed",
              statusCode: 401,
              errorMessage: err,
            },
            message: "Wrong Credentials.",
          });
        }
        if (result) {
          userDoc = {
            email: userDoc.email,
            name: userDoc.name,
            userType: "user",
          };

          const token = jwt.sign(
            {
              email: userDoc.email,
              _id: userDoc._id,
            },
            process.env.JWT_KEY,
            {
              expiresIn: "2h",
            }
          );

          return res.status(200).json({
            user: userDoc,
            token,
            request: {
              type: "POST",
              description: "Logging in",
              URL: "http://localhost:5000/login",
            },
          });
        }
        return res.status(401).json({
          error: {
            status: "Auth Failed",
            statusCode: 401,
          },
          message: "No User Found with given Email and Password.",
        });
      });
    } else {
      return res.status(404).json({
        status: "User Not Found",
        statusCode: 404,
        message: "No User found with the given credentials.",
      });
    }
  } catch (err) {
    return res.status(500).json({
      error: {
        status: "Failed",
        statusCode: 500,
        errorMessage: err,
      },
      message: "Error occured while trying to Log In.",
    });
  }
};
