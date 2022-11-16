const { validateEmail, validateLength } = require("../helpers/validation");
const Users = require("../models/users");
const bcrypt = require("bcrypt");
const { generateToken } = require("../helpers/token");

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
