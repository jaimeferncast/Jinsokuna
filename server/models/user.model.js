const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["GESTOR", "EDITOR"],
      default: "GESTOR"
    }
  },
  {
    timestamps: true
  }
)

const User = mongoose.model("User", userSchema);
module.exports = User;
