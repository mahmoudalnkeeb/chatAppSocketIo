const mongoose = require("mongoose");

const online = new mongoose.Schema({
  nameOnline: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("online", online);
