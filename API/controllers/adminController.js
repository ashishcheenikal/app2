const Users = require("../models/users");
const bcrypt = require("bcrypt");
const { generateToken } = require("../helpers/token");
const jwt = require("jsonwebtoken");
const Meeting = require("../models/Meeting");
const { nanoid } = require("nanoid");
const { fork } = require("child_process");
const nodemailer = require("nodemailer");
const ejs = require("ejs");


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
    if (!user.admin) {
      return res.json({
        success: false,
        message: "You are not authorized to access this website",
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
    console.log("AllUsers");
    const AllUsers = res.searchResults;
    console.log(AllUsers);
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
    const slug = nanoid(10);
    console.log(slug, "nanoID");
    console.log(req.body.user);
    const { meetName, host, participants, currentDate } = req.body.user;
    const addMeeting = await Meeting.create({
      meetName,
      host,
      participants,
      scheduledTime: currentDate,
      slug,
    });
    const id = addMeeting._id
    const meeting = await Meeting.findById(id)
      .populate({ path: "host", select: ["firstName", "lastName", "email"] })
      .populate({
        path: "participants",
        select: ["firstName", "lastName", "email"],
      });
    const child = fork("./views/sendMail");
    child.send({meeting:meeting});
    child.on("exit", (data) => {
      console.log("Child exited with a code of ",data);
    });
    res.status(200).json({
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
    const allMeeting = res.paginatedResults;
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
    console.log("DetailMeeting");
    const id = req.params.id;
    const meeting = await Meeting.findById(id)
      .populate({ path: "host", select: ["firstName", "lastName"] })
      .populate({ path: "participants", select: ["firstName", "lastName"] });
    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
        data: {},
      });
    }
    return res.status(200).json({
      success: true,
      message: "Details of Meeting",
      data: meeting,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.EditMeeting = async (req, res) => {
  try {
    console.log("EditMeeting");
    const id = req.params.id;
    console.log(id);
    console.log(req.body.user);
    const { meetName, host, participants, currentDate } = req.body.user;
    const meeting = await Meeting.findByIdAndUpdate(id, {
      meetName,
      host,
      participants,
      scheduledTime: currentDate,
    });
    res.status(200).json({
      success: true,
      message: "Meeting Edited successfully",
      data: meeting,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.CancelMeeting = async (req, res) => {
  try {
    console.log("CancelMeeting");
    const id = req.params.id;
    const meeting = await Meeting.findById(id);
    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
        data: {},
      });
    }
    console.log(meeting);
    const change = await Meeting.findByIdAndUpdate(id, { status: "Cancelled" });
    return res.status(200).json({
      success: true,
      message: "Meeting Cancelled",
      data: change,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// exports.sendMail = async (req, res) => {
//   try {
//     const id = "637dc38e171d3bd4f76dfdc0";
//     const meeting = await Meeting.findById(id)
//       .populate({ path: "host", select: ["firstName", "lastName", "email"] })
//       .populate({
//         path: "participants",
//         select: ["firstName", "lastName", "email"],
//       });
//     const child = fork("./views/sendMail");
//     child.send({meeting:meeting});
//     child.on("message", (data) => {
//       console.log("Child exited with a code of ",data);
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
