const User = require('../models/users')
const Cart = require('../models/cart')
const jwt = require('jsonwebtoken')
const base64url = require('base64url')
const { promisify } = require('util')
const axios = require('axios')
const crypto = require('crypto')
const catchError = require('../Errors/catch')
const AppError = require('../Errors/classError')
const Email = require('./email')
const validator = require('validator');
const helper = require('./helperFunc')


exports.signPage = catchError(async (req, res, next) => {
  res.render('user/createAccount', {
    country: helper.getCountry(),
    title: 'Sign up',
    errors: req.flash('errors'),
    warning: req.flash('warning'),
    success: req.flash('success'),
    toast: req.flash('toast'),
  })
})

exports.logPage = catchError(async (req, res, next) => {
  res.render('user/registration', {
    title: 'Log In',
    errors: req.flash('errors'),
    warning: req.flash('warning'),
    success: req.flash('success'),
    toast: req.flash('toast'),
  })
})


exports.verifyPage = catchError(async (req, res, next) => {
  res.render('user/verification', {
    title: 'Verify your email',
    email: req.user.email,
    errors: req.flash('errors'),
    warning: req.flash('warning'),
    success: req.flash('success'),
    toast: req.flash('toast'),
  })
})

exports.forgetPage = catchError(async (req, res, next) => {
  res.render('user/forget', {
    title: 'Forget password',
    errors: req.flash('errors'),
    warning: req.flash('warning'),
    success: req.flash('success'),
    toast: req.flash('toast'),
  });
})









exports.changEmailVerify = catchError(async (req, res, next) => {
  const { email } = req.body
  const user = req.user
  if (!email) return next(new AppError('Email required', 401))
  if (email == user.email) return next(new AppError('Email is used', 401))
  user.email = email
  const token = await user.createToken('email')
  await user.save()
  const url = `${req.protocol}://${req.get('host')}/auth/signup/verify/${token}`
  await new Email(user, url).verify()
  res.status(200).json({ redirect: '/auth/signup/verify' })
})

exports.resendEmail = catchError(async (req, res, next) => {
  const user = req.user
  const token = await user.createToken('email')
  await user.save()
  const url = `${req.protocol}://${req.get('host')}/auth/signup/verify/${token}`
  await new Email(req.user, url).verify()
  res.status(200).send('Email send')
})













exports.checkEmail = catchError(async (req, res, next) => {
  const email = req.body.email
  const user = await User.findOne({ email })
  if (user) res.status(200).send(false)
  else res.status(201).send(true)
})






























exports.isEmailConfig = catchError(async (req, res, next) => {
  const { user, time } = await helper.testJwtToken(req, res)
  if (user && !user.isChangedPass(time)) {
    req.user = user
    if (!user.emailConfig) return next()
  }
  req.flash('toast', 'Your Email is confirmed')
  res.status(300).redirect('/')
})



exports.checkAuth = async (req, res, next) => {
  const { user, time } = await helper.testJwtToken(req, res, next)
  if (user && !user.isChangedPass(time)) {
    req.flash('warning', 'You are register')
    return res.status(403).redirect('/')
  }
  next()
}

exports.signUp = catchError(async (req, res, next) => {
  //? create a user
  const user = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    country: req.body.country
  })
  await user.createCart(Cart)
  const token = await user.createToken('email')
  await user.save()
  const url = `${req.protocol}://${req.get('host')}/auth/signup/verify/${token}`
  await new Email(user, url).verify()
  const jwtToken = await helper.createJwtToken(user._id)
  res.cookie('jwt', jwtToken, helper.cookieOptions).status(200).json({ redirect: '/auth/signup/verify' })
})

exports.verify = async (req, res, next) => {
  const token = crypto.createHash('sha256').update(req.params.token).digest('hex')
  const user = await User.findOne({ emailToken: token, expEmailToken: { $gt: Date.now() } })
  if (!user) return next(new AppError('Email Date is expired', 404))
  user.emailConfig = true
  user.emailToken = undefined
  user.expEmailToken = undefined
  await user.save()
  req.flash('success', 'verification Email')
  res.status(200).redirect('/')
  helper.sendSocket('emailConfirmed')
  const url = `${req.protocol}://${req.get('host')}`
  await new Email(req.user, url).welcome()
}





exports.logIn = catchError(async (req, res, next) => {
  //? 1) if email & password are send
  const { email, password } = req.body
  if (!email) return next(new AppError('Email required', 401))
  if (!password) return next(new AppError('Password required', 401))
  if (password.length < 8) return next(new AppError('Password is incorrect', 401))

  //? 2) if user is exist & correct password
  const user = await User.findOne({ email }).select('+password')
  if (!user) return next(new AppError('Email is incorrect', 401))
  if (!(await user.isCorrectPass(password, user.password))) return next(new AppError('Password is incorrect', 401))

  //? 3) create a token send a success response
  const jwtToken = await helper.createJwtToken(user._id)
  req.flash('success', 'Welcome ' + user.firstName)
  res.cookie('jwt', jwtToken, helper.cookieOptions).status(200).json({ redirect: '/' })
})

exports.logOut = catchError(async (req, res, next) => {
  if (req.body.data == 'logOut' && req.cookies.jwt) {
    res.cookie('jwt', 'out', { expires: new Date(Date.now() + 1_000_0), httpOnly: true })
    req.flash('success', 'Log out')
    res.status(200).json({ redirect: '/' })
  } else next(new AppError('You aren\'t register', 401))
})




exports.forgetPass = catchError(async (req, res, next) => {
  //? 1) check user by email
  const user = await User.findOne({ email: req.body.email })
  if (!user) return next(new AppError('Email is incorrect.', 401))

  //? 2) generate a random token
  const token = user.createToken('password')

  //? 3) send a email
  const url = `${req.protocol}://${req.get('host')}${req.originalUrl}/${token}`
  const options = {
    url: url,
    email: user.email,
    name: user.firstName,
    subject: 'Reset your password',
    about: 'password'
  }
  await helper.senderEmail(options, next)
  await user.save()
  res.status(201).send('Email sent')
})

exports.resetPass = catchError(async (req, res, next) => {
  const token = crypto.createHash('sha256').update(req.params.token).digest('hex')
  const newPassword = req.body.newPassword

  //? 1) Get a user based on token & expired date
  const user = await User.findOne({ passwordToken: token, expPasswordToken: { $gt: Date.now() } }).select('+password')
  if (!user) return next(new AppError('Page is not found or Email Date is expired', 404))

  //? 2) Save a new password
  user.password = newPassword
  user.passwordToken = undefined
  user.expPasswordToken = undefined
  const jwtToken = await helper.createJwtToken(user._id)
  await user.save()

  //? 4) log in user & send a token
  res.cookie('jwt', helper.cookieOptions, jwtToken,).status(200).redirect("/")
})






















