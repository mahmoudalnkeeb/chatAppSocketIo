const mongoose = require("mongoose");

const UsersSchema = new mongoose.Schema({
  user_name: {
    type: String,
    required: true,
  },
  userMsgsNo: {
    type: Number,
    required: false,
  },
});

module.exports = mongoose.model("User", UsersSchema);
