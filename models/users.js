const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs'); //passport

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
  carte: {
    type: Array,
    default: [],
  },
  date: {
    type: Date,
    default: Date.now(),
  }
});

// password لتشفير 
// userSchema.methods.hashPassword = (password) => {
//   return bcrypt.hashSync(password, bcrypt.genSaltSync(15));
// }

// password لمقارنة 
// userSchema.methods.comparePassword = (password, hash) => {
//   return bcrypt.compareSync(password, hash);
// }
// mongoose.models = {};
let User = mongoose.model("User", userSchema, "users");
module.exports = User;