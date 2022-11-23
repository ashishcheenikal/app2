const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const slug = require("mongoose-slug-generator");

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
      slug: "host",
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);
const options = {
  separator: "-",
  lang: "en",
  truncate: 120,
};
MeetingSchema.plugin(slug, options);

module.exports = mongoose.model("Meeting", MeetingSchema);
