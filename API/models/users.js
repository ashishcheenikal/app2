const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First Name required"],
    },
    lastName: {
      type: String,
      required: [true, "Last Name required"],
    },
    email: {
      type: String,
      required: [true, "Email Name required"],
    },
    password: {
      type: String,
      required: [true, "Password Name required"],
    },
    admin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
