const mongoose = require("mongoose");

const MsgsSchema = new mongoose.Schema({
  msg: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("msg", MsgsSchema);
