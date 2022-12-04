const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const MessageSchema = new mongoose.Schema(
  {
    roomId: {
      type: Array,
    },
    sender: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    text : {
        type: String,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Message", MessageSchema);
