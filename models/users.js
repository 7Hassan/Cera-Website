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
  role: {
    type: String,
    enum: ['user', 'admin', 'member', 'default'],
    default: 'user'
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: [true, 'Email must be lowercase'],
    validate: [
      {
        validator: validator.isEmail,
        message: 'Email is not valid'
      },
      {
        validator: async function (email) {
          if (this.role === 'default') return true
          return !await this.constructor.findOne({ _id: { $ne: this._id }, email })
        },
        message: 'Email already exists'
      }
    ]
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
  img: {
    type: String,
    default: 'https://firebasestorage.googleapis.com/v0/b/cera-1d79c.appspot.com/o/users%2Fdefault.webp?alt=media&token=a03185a4-0d2a-430c-bf29-8a4724975fbf&_gl=1*pnsezd*_ga*Njk0MTExMjMzLjE2OTc4MzQzODA.*_ga_CW55HF8NVT*MTY5Nzg3MTU5Mi4yLjEuMTY5Nzg3NDc2NS4xNy4wLjA.'
  },
  country: {
    type: String,
    minlength: [1, 'Country is required'],
    required: [true, 'Country is required']
  },
  cart: {
    type: mongoose.Schema.ObjectId,
    ref: 'carts',
  },
  date: {
    type: Date,
    default: Date.now(),
  }
});

//? Hashing a password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next() //? password is not change
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

//? show a cart which linked with this user pre any find
userSchema.pre(/^find/, async function () {
  this.select("-__v").populate({ path: 'cart', select: "-__v" })
})

//? create a cart
userSchema.methods.createCart = async function (Cart) {
  const cart = await Cart.create({ user: this._id })
  this.cart = cart._id
}


let User = mongoose.model('users', userSchema)
module.exports = User;