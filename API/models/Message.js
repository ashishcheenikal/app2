const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const MessageSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
    },
    // users: Array,
    sender: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    message: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Message", MessageSchema);
