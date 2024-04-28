const crypto = require("crypto");
const bcrypt = require("bcrypt");
const twilio = require("twilio");

const User = require("../models/user");
const otpUser = require("../models/otpUser");

exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check if the username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    const bcryptPass = await bcrypt.hash(password, 12);

    // Create a new user instance
    const newUser = new User({ username, email, password: bcryptPass });

    // Save the new user to the database
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error signing up:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const existsUser = await User.findOne({ email });

    if (!existsUser) {
      return res.status(404).json({ message: "Email not found!" });
    }

    const validatePass = await bcrypt.compare(password, existsUser.password);

    if (!validatePass) {
      return res.status(400).json({ message: "Password dose not match!" });
    }

    res.status(201).json({ message: "User Logged successfully" });
  } catch {
    console.error("Error Login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.sendOtp = async (req, res, next) => {
  const { mobile } = req.body;

  const accountSid = "AC84da302688264329cc67e9807b4bd650";
  const authToken = "0a577efb59db9a96e602c2d6457e39d4";
  const twilioPhoneNumber = +12513062905;
  const mobileNumber = `+91${mobile}`;

  const client = new twilio(accountSid, authToken);

  try {
    const otp = crypto.randomInt(100000, 999999);
    const expiresAt = new Date(new Date().getTime() + 10 * 60000); // OTP expires in 10 minutes

    const user = await otpUser.findOneAndUpdate(
      { mobile: mobileNumber },
      {
        $set: {
          "otp.code": otp.toString(),
          "otp.expiresAt": expiresAt,
        },
      },
      { new: true, upsert: true }
    );

    await client.messages.create({
      to: mobileNumber,
      from: twilioPhoneNumber,
      body: `Your OTP is ${otp}. It will expire in 10 minutes.`,
    });

    res.status(200).json({ message: "OTP sent successfully." });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res
      .status(500)
      .json({ message: "Failed to send OTP due to internal error." });
  }
};

exports.verifyOtp = async (req, res, next) => {
  const { mobile, otp } = req.body;

  const mobileNumber = `+91${mobile}`;

  try {
    const user = await otpUser.findOne({ mobile: mobileNumber });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.otp.expiresAt < new Date()) {
      return res.status(408).json({ message: "OTP has expired." });
    }

    if (user.otp.code !== otp.toString()) {
      return res.status(401).json({ message: "Invalid OTP." });
    }

    res.status(200).json({ message: "OTP verified successfully." });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res
      .status(500)
      .json({ message: "Failed to verify OTP due to internal error." });
  }
};
