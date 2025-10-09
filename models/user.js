const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    user_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 4,
    },
    isBlock: {
      type: Boolean,
      default: false,
    },
    resetOtp: {
      type: Number,
      otpExpires: Date,
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model('user',userSchema)