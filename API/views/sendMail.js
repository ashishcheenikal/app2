const nodemailer = require("nodemailer");
const ejs = require("ejs");


process.on("message", async({meeting}) => {
  console.log(meeting)
  const { host, participants,slug } = meeting;
  const emailHost = host?.map((value) => {
    return value.email;
  });
  const emailParticipants = participants?.map((value) => {
    return value.email;
  });
  console.log(emailHost);
  console.log(emailParticipants);
  let transporter = nodemailer.createTransport({
    service: "gmail",
    secure: false, // true for 465, false for other ports
    auth: {
      user: `${process.env.FROM_EMAIL}`, // generated ethereal user
      pass: `${process.env.APP_PASSWORD}`, // generated ethereal password
    },
  });
  
  const html = await ejs.renderFile("views/invitation.ejs", {
    Link: `${process.env.RESET_URL}/meeting/${slug}`,
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `"Meeting invitation Mail" <${process.env.FROM_EMAIL}>`, // sender address
    to: emailHost, // list of receivers
    subject: "Meeting invitation Mail", // Subject line
    html: html,
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  console.log("mail")
  process.exit(1)
})