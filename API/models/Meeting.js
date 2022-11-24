const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const MeetingSchema = new mongoose.Schema(
  {
    meetName: {
      type: String,
      required: true,
    },
    host: [
      {
        type: ObjectId,
        ref: "User",
        required: true,
      },
    ],
    participants: [
      {
        type: ObjectId,
        ref: "User",
        required: true,
      },
    ],
    scheduledTime: {
      type: Date,
      default: Date.now,
      required: true,
    },
    status: {
      type: String,
      enum: ["Scheduled", "Completed", "Cancelled"],
      default: "Scheduled",
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Meeting", MeetingSchema);
