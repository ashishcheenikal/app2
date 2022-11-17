const { validateEmail, validateLength } = require("../helpers/validation");
const Users = require("../models/users");
const bcrypt = require("bcrypt");
const { generateToken } = require("../helpers/token");
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

exports.register = async (req, res) => {
  try {
    console.log("registration");
    const { firstName, lastName, email, password } = req.body.user;
    const check = await Users.findOne({ email });
    if (check) {
      return res.json({
        success: false,
        message:
          "This email address is already exists, try with a different email address",
        data: {},
      });
    }
    const cryptedPassword = await bcrypt.hash(password, 12);
    const user = await Users.create({
      firstName,
      lastName,
      email,
      password: cryptedPassword,
    });
    const token = generateToken({ id: user._id.toString() }, "7d");
    return res.status(200).json({
      success: true,
      message: "User Register successfully",
      data: {
        user: user,
        token: token,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    console.log("Login");
    console.log(req.body.user);
    const { email, password } = req.body.user;
    const user = await Users.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "This email not registered. Please register",
        data: {},
      });
    }
    const check = await bcrypt.compare(password, user.password);
    if (!check) {
      return res.json({
        success: false,
        message: "Invalid credentials",
        data: {},
      });
    }
    const token = generateToken({ id: user._id.toString() }, "7d");
    return res.status(200).json({
      success: true,
      message: "User Logged-In successfully",
      data: {
        user: user,
        token: token,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    console.log(req.body.user);
    const { email } = req.body.user;
    const user = await Users.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "This email not registered. Please register",
        data: {},
      });
    }
    let secret = process.env.JWT_SECRET_KEY + user.password;
    let payload = {
      email: email,
      id: user._id.toString(),
    };
    const token = jwt.sign(payload, secret, {
      expiresIn: "15m",
    });
    const msg = {
      to: "fabalen286@sopulit.com",
      from: process.env.FROM_EMAIL,
      subject: "Sending with Twilio SendGrid is Fun",
      // text: "and easy to do anywhere, even with Node.js",
      html: "<h2>and easy to do anywhere, even with Node.js</h2>",
    };
    sgMail
      .send(msg)
      .then((data) => {
        console.log(data,"Api response: ");
      })
      .catch((error) => {
        console.log(error);
      });

    return res.status(200).json({
      success: true,
      message: "Reset password Link send to your registered email address",
      data: {
        user: user,
        token: token,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
