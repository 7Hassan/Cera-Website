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

let User = mongoose.model('users', userSchema)
module.exports = User;