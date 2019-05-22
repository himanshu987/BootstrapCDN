var mongoose = require("mongoose");

// Page Schema
var ContactSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
});

var Contact = (module.exports = mongoose.model("Contact", ContactSchema));
