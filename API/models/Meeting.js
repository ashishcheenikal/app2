const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const slug = require("mongoose-slug-generator");

const MeetingSchema = new mongoose.Schema(
  {
    host: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],
    participants: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],
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

module.exports = mongoose.model("Meeting",MeetingSchema)

