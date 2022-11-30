const Users = require("../models/users");
const bcrypt = require("bcrypt");
const { generateToken } = require("../helpers/token");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const { findOne } = require("../models/users");

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
    if(user.admin){
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

    let secret = process.env.JWT_SECRET_KEY + user.password ;
    const id = user._id.toString();

    let payload = {
      email: email,
      id: id,
    };

    const token = jwt.sign(payload, secret, {
      expiresIn: "15m",
    });
    let transporter = nodemailer.createTransport({
      service: "gmail",
      secure: false, // true for 465, false for other ports
      auth: {
        user: `${process.env.FROM_EMAIL}`, // generated ethereal user
        pass: `${process.env.APP_PASSWORD}`, // generated ethereal password
      },
    });

    const html = await ejs.renderFile("views/forgetPassword.ejs", {
      Link: `${process.env.RESET_URL}/newPassword/${id}/${token}`,
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: `"Password Reset Link" <${process.env.FROM_EMAIL}>`, // sender address
      to: email, // list of receivers
      subject: "Password Reset Link", // Subject line
      html: html,
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

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

exports.newPassword = async (req, res) => {
  try {
    const { id, token } = req.params;
    const { password, confirmPassword } = req.body.user;
    const user = await Users.findById(id);
    if (!user) {
      return res.json({
        success: false,
        message: "Invalid Link",
        data: {},
      });
    }
    let secret = process.env.JWT_SECRET_KEY  + user.password;

    const payload = jwt.verify(token, secret);
    console.log(payload);
    if (!payload) {
      return res.json({
        success: false,
        message: "Invalid Link",
        data: {},
      });
    }
    const cryptedPassword = await bcrypt.hash(password, 12);
    const newUserData = await Users.findByIdAndUpdate(id, {
      password: cryptedPassword,
    });
    return res.status(200).json({
      success: true,
      message: "Password Update successfully",
      data: {
        user: newUserData,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.GetAllMeeting = async (req, res) => {
  try {
    console.log("GetAllMeeting/user");
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

exports.joinMeeting = async(req,res)=>{
  try {
    const slug = req.params.id;
    const userId = req.user.id;
    console.log(slug,"slug")
    console.log(userId,"userId")
    const meeting = await findOne({slug: slug});
    if(meeting.host.includes(userId) || meeting.participants.includes(userId))
    {
      return res.status(200).json({
        success : true,
        message : "Joined meeting successfully",
        data : meeting
      })
    }
    return res.status(403).json({
      success : true,
        message : "This user is not a member of this meeting",
        data : {}
    });
  } catch (error) {
    res.status(500).json({message:error.message})
  }
}