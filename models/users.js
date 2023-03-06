/* eslint-disable func-names */
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    maxlength: [15, 'First name is more than 15 characters'],
    minlength: [3, 'First name is less than 3 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    minlength: [3, 'Last name is less than 3 characters']

  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: [true, 'Email must be lowercase'],
    validate: [validator.isEmail, 'Email is not valid']
  },
  emailConfig: {
    type: Boolean,
    default: false
  },
  emailToken: String,
  expEmailToken: Date,
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password is less than 8 character'],
    select: false //? not sending a password only by use select('+password')
  },
  passwordToken: String,
  expPasswordToken: Date,
  role: {
    type: String,
    enum: ['user', 'admin', 'member'],
    default: 'user'
  },
  country: {
    type: String,
    minlength: [1, 'Country is required'],
    required: [true, 'Country is required']
  },
  date: {
    type: Date,
    default: Date.now(),
  }
});

//? Hashing a password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 10)
  this.date = Date.now() - 1000
  next()
})

//? correct password
userSchema.methods.isCorrectPass = async function (password, hashPassword) {
  return await bcrypt.compare(password, hashPassword)
}

//? password changed & data updated
userSchema.methods.isChangedPass = function (dateToken) {
  const dateUser = parseInt(this.date.getTime() / 1000) //? in S
  return (dateUser > dateToken)
}

//? create a token & save
userSchema.methods.createToken = function (validation) {
  const token = crypto.randomBytes(32).toString('hex') //? create a token
  if (validation == 'password') {
    this.passwordToken = crypto.createHash('sha256').update(token).digest('hex') //? Hash a token & save
    this.expPasswordToken = Date.now() + 30 * 60 * 1000 //? date now + 30 minutes
  }
  if (validation == 'email') {
    this.emailToken = crypto.createHash('sha256').update(token).digest('hex') //? Hash a token & save
    this.expEmailToken = Date.now() + 24 * 60 * 60 * 1000 //? date now + 24 hours
  }

  return token
}


let User = mongoose.model('users', userSchema)
module.exports = User;