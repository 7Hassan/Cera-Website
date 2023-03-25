const User = require('../models/users')
const Cart = require('../models/cart')
const jwt = require('jsonwebtoken')
const base64url = require('base64url')
const { promisify } = require('util')
const axios = require('axios')
const crypto = require('crypto')
const catchError = require('../Errors/catch')
const AppError = require('../Errors/classError')
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
  if (!email) return next(new AppError('Email required', 401))
  if (email == req.user.email) return next(new AppError('Email is used', 401))
  const user = await User.findOne({ email: req.user.email })
  user.email = email
  const token = await user.createToken('email')
  await user.save()
  const url = `${req.protocol}://${req.get('host')}${req.originalUrl}/${token}`
  const options = {
    url: url,
    email: user.email,
    name: user.firstName,
    subject: 'Verify your email address',
    about: 'email'
  }
  await helper.senderEmail(options, next)
  res.status(200).json({ redirect: '/auth/signup/verify' })
})












exports.checkEmail = catchError(async (req, res, next) => {
  const email = req.body.email
  const user = await User.findOne({ email })
  if (user) res.status(200).send(false)
  else res.status(201).send(true)
})



























//TODO: check if user
exports.isUser = async (req, res, next) => {
  const { user, time } = await helper.testJwtToken(req, res)
  if (user && !user.isChangedPass(time)) {
    req.user = user
    res.locals.user = user
    if (user.emailConfig) next()
    else {
      req.flash('warning', 'Confirm your Email to get access')
      res.status(300).redirect('/')
    }
  } else {
    req.flash('toast', 'Please log in first')
    res.status(300).redirect('/')
  }
}


exports.isEmailConfig = async (req, res, next) => {
  const { user, time } = await helper.testJwtToken(req, res)
  if (user && !user.isChangedPass(time)) {
    req.user = user
    if (!user.emailConfig) return next()
  }
  req.flash('toast', 'Your Email is confirmed')
  res.status(300).redirect('/')
}




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

  const url = `${req.protocol}://${req.get('host')}${req.originalUrl}/verify/${token}`
  const options = {
    url: url,
    email: user.email,
    name: user.firstName,
    subject: 'Verify your email address',
    about: 'email'
  }
  await helper.senderEmail(options, next)
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

exports.updateUserData = catchError(async (req, res, next) => {
  //1) get data
  const { firstName, lastName, email } = req.body
  //2) check data
  if (!firstName) return next(new AppError('First name required', 401))
  if (!lastName) return next(new AppError('Last name required', 401))
  if (!email) return next(new AppError('Email required', 401))
  if (firstName.length < 3) return next(new AppError('First name is Too short', 401))
  if (lastName.length < 3) return next(new AppError('Last name is Too short', 401))
  if (firstName.length > 16) return next(new AppError('First name is Too long', 401))
  if (lastName.length > 16) return next(new AppError('Last name is Too long', 401))
  if (!email) return next(new AppError('Email required', 401))
  //3) get user
  const user = await User.findById(req.user.id)
  //4) update password
  if (user.firstName !== firstName) user.firstName = firstName
  if (user.lastName !== lastName) user.lastName = lastName
  if (user.email !== email) {
    user.email = email
    user.emailConfig = false
  }
  await user.save()
  req.flash('success', 'Data updated')
  res.status(200).json({ redirect: '/' })
})

exports.updatePassword = catchError(async (req, res, next) => {
  //1) get data
  const { currentPass, newPass, confirmPass } = req.body
  //2) check data
  if (!currentPass) return next(new AppError('Current password required', 401))
  if (!newPass) return next(new AppError('New password required', 401))
  if (!confirmPass) return next(new AppError('Confirm password required', 401))
  if (confirmPass !== newPass) return next(new AppError('Confirm password isn\'t match', 401))
  if (currentPass.length < 8) return next(new AppError('Current password Incorrect', 401))
  if (currentPass.length < 8) return next(new AppError('New password is less than 8 character', 401))
  //3) check if current password is correct
  const user = await User.findById(req.user.id).select('+password')
  if (!(await user.isCorrectPass(currentPass, user.password))) return next(new AppError('Current Password is incorrect', 401))
  //4) update password
  user.password = newPass
  const jwtToken = await helper.createJwtToken(user._id)
  await user.save()
  req.flash('success', 'Password updated')
  res.cookie('jwt', jwtToken, helper.cookieOptions).status(200).json({ redirect: '/' })
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






















