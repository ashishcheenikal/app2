const Users = require("../models/users");
const bcrypt = require("bcrypt");
const { generateToken } = require("../helpers/token");
const jwt = require("jsonwebtoken");
const Meeting = require("../models/Meeting");

exports.login = async (req, res) => {
  try {
    console.log("Admin-Login");
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
      message: "Admin Logged-In successfully",
      data: {
        user: user,
        token: token,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.AllUsers = async (req, res) => {
  try {
    console.log('AllUsers')
    const AllUsers = await Users.find();
    if (!AllUsers) {
      return res.status(404).json({
        success: false,
        message: "Currently no users available",
        data: {},
      });
    }
    return res.status(200).json({
      success: true,
      message: "List of all users ",
      data: AllUsers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.AddMeeting = async (req, res) => {
  try {
    console.log("AddMeeting");
    const { host, participants } = req.body.user;
    const meeting = await Meeting.create({
      host,
      participants,
    });
    return res.status(200).json({
      success: true,
      message: "Meeting created successfully",
      data: meeting,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.GetAllMeeting = async (req, res) => {
  try {
    console.log("GetAllMeeting");
    const allMeeting = await Meeting.find({});
    return res.status(200).json({
      success: true,
      message: "List of all meetings ",
      data: allMeeting,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.DetailMeeting = async (req, res) => {
  try {
    console.log('DetailMeeting')
    console.log(req.body.user)
    const { id } = req.body.user;
    const meeting = await Meeting.findById(id);
    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
        data:{}
      })
    }
    return res.status(200).json({
      success:true,
      message:"Details of Meeting",
      data: meeting
    })
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.EditMeeting = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.DeleteMeeting = async (req, res) => {
  try {
    console.log('DeleteMeeting')
    console.log(req.body.user)
    const { id } = req.body.user;
    const meeting = await Meeting.findById(id);
    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
        data:{}
      })
    }
    return res.status(200).json({
      success:true,
      message:"Details of Meeting",
      data: meeting
    })
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
