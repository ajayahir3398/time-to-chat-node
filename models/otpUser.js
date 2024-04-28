const mongoose = require("mongoose");

const otpUserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  mobile: { type: String, required: true, unique: true },
  hash: { type: String, required: false }, // For storing password or other auth mechanism
  otp: {
    code: String,
    expiresAt: Date,
  },
});

module.exports = mongoose.model("otpUser", otpUserSchema);
