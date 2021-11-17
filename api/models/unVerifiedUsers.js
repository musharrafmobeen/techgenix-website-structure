const mongoose = require("mongoose");

const unVerifiedUserSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: {
    type: String,
    required: true,
    match:
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  },
  name: { type: String, required: true },
  password: { type: String, required: true },
  verificationId: { type: String, required: true },
});

module.exports = mongoose.model(" unVerifiedUsers", unVerifiedUserSchema);
