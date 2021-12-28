const express = require("express");
const app = express();
const morgan = require("morgan");
const multer = require("multer");
const upload = multer();
const adminRoutes = require("./api/routes/admin");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

mongoose.connect(
  "mongodb+srv://musharrafmobeen:" +
    process.env.Mongo_db_Atlas_PW +
    "@cluster0.hzdwn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
);

app.use(cors());
app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-requested-with, Content-Type, Access, Authorization"
  );
  if (req.method === "OPTIONS") {
    req.header("Access-Control-Allow-Methods", "PUT, PATCH, DELETE, GET, POST");
    return req.status(200).json({});
  }
  next();
});

app.use("/admin", adminRoutes);
app.use("/jobs", require("./api/routes/jobs"));
app.use("/users", require("./api/routes/users"));
app.use("/jobApplication", require("./api/routes/candidates"));
app.use("/login", require("./api/routes/login"));
app.use("/sendEmail", require("./api/routes/contact"));
app.use(upload.array());

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
