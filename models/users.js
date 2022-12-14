const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    require: true,
  },
  lastName: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  emailConf: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    require: true,
  },
  country: {
    type: String,
    require: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  }
});


let User = mongoose.model("User", userSchema, "users");
module.exports = User;