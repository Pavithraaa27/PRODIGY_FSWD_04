const mongoose = require("mongoose");

const responseSchema = new mongoose.Schema({
  keywords: [String],
  reply: String,
  emotion: String,
});

module.exports = mongoose.model("Response", responseSchema);