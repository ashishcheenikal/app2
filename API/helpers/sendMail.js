const Users = require("../models/users");
const bcrypt = require("bcrypt");
const { generateToken } = require("../helpers/token");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const ejs = require("ejs");


exports.sendMail = async()=>{
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
  
}


process.on("message",(message)=>{
    if(message === "sendMail"){
        const data = "set aakikoo"
        process.send(data)
    }
})