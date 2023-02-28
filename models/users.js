const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    require: [true, 'First name is required'],
    maxlength: [15, 'First name is more than 15 characters'],
    minlength: [3, 'First name is less than 3 characters']
  },
  lastName: {
    type: String,
    require: [true, 'Last name is required'],
    minlength: [3, 'Last name is less than 3 characters']

  },
  email: {
    type: String,
    require: [true, 'Email is required'],
    unique: true,
    lowercase: [true, 'Email must be lowercase'],
    validate: [validator.isEmail, 'Email is not valid']
  },
  password: {
    type: String,
    require: [true, 'Password is required'],
    minlength: [8, 'Password is less than 8 character']
  },
  country: {
    type: String,
    minlength: [1, 'Country is required'],
    require: [true, 'Country is required']
  },
  date: {
    type: Date,
    default: Date.now(),
  }
});

//? Hashing a password
// eslint-disable-next-line func-names
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash('his.password', 10)
  next()
})





let User = mongoose.model('users', userSchema)
module.exports = User;