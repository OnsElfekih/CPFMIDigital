const mongoose = require("mongoose");

const LoginLogSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  ip: {
    type: String,
    required: true,
  },
  success: {
    type: Boolean,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("LoginLog", LoginLogSchema);
