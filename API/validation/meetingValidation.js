const yup = require("yup");

const MeetingSchema = yup.object({
  meetName: yup.string().required("Meeting's name is required"),
  host: yup.array().required("Host is required"),
  participants: yup.array().required(" Participants are required"),
//   scheduledTime:yup.date().required("Date and Time should be allocated for the meeting")
});

module.exports = MeetingSchema;
