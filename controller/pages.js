const User = require('../models/users')
const Product = require('../models/products')
const catchError = require('../Errors/catch')
const helper = require('./helperFunc')
const AppError = require('../Errors/classError')


exports.aboutPage = (req, res) => res.render('pages/about', helper.pageObject('About Us', req))
exports.paymentPage = (req, res) => res.render('pages/payment', helper.pageObject('Payment', req))
exports.contactPage = (req, res) => res.render('pages/contact', helper.pageObject('Contact Us', req))
exports.blogPage = (req, res) => res.render('pages/blog', helper.pageObject('Blog', req))
exports.notFoundPage = (req, res) => res.status(404).render('pages/404', helper.pageObject('404', req))
exports.settingPage = (req, res, next) => res.render('pages/setting', helper.pageObject('Cera | Account', req))

exports.homePage = catchError(async (req, res, next) => {
  res.render('pages/index', {
    featureProd: await Product.find({ stoked: false }),
    newProd: await Product.find({ new: true }),
    title: 'Cera',
    errors: req.flash('errors'),
    warning: req.flash('warning'),
    success: req.flash('success'),
    toast: req.flash('toast'),
  })
})

exports.shopPage = catchError(async (req, res, next) => {
  let result = await Product.find().sort({ "name": -1 })
  res.render('pages/shop', {
    title: 'Cera | Shop',
    products: helper.sliceDataShop(result, 8),
    errors: req.flash('errors'),
    warning: req.flash('warning'),
    success: req.flash('success'),
    toast: req.flash('toast'),
  })
})

exports.singleProd = catchError(async (req, res, next) => {
  const singleProduct = await Product.findOne({ _id: req.params.id })
  let result = await Product.find({ stoked: true, name: singleProduct.name }).sort({ "price": -1 })
  res.render('pages/product', {
    title: 'Product', product: singleProduct,
    products: result,
    errors: req.flash('errors'),
    warning: req.flash('warning'),
    success: req.flash('success'),
    toast: req.flash('toast'),
  });
})







exports.userData = catchError(async (req, res, next) => {
  const { user, time } = await helper.testJwtToken(req, res, next)
  if (user && !user.isChangedPass(time)) {
    res.locals.user = user
    req.user = user
    return next()
  }
  res.locals.user = ''
  next()
})

//TODO: check if user
exports.isUser = catchError(async (req, res, next) => {
  const user = req.user
  if (user) {
    res.locals.user = user
    if (user.emailConfig) return next()
    req.flash('warning', 'Confirm your Email to get access')
    res.status(300).redirect('/')
  } else {
    req.flash('toast', 'Please log in first')
    res.status(300).redirect('/')
  }
})

exports.upload = helper.upload.single('userImg')

exports.resizeImg = catchError(async (req, res, next) => {
  if (!req.file) return next()
  req.file.filename = `user-img-${req.user.id}-${Date.now()}.jpeg`
  helper.sharpImg(req)
  next()
})

exports.updateUserData = catchError(async (req, res, next) => {
  //1) get data
  const user = req.user
  const { firstName, lastName, email } = req.body
  const userImg = req.file ? req.file.filename : undefined

  //2) check data
  if (!firstName) return next(new AppError('First name required', 401))
  if (!lastName) return next(new AppError('Last name required', 401))
  if (!email) return next(new AppError('Email required', 401))
  if (firstName.length < 3) return next(new AppError('First name is Too short', 401))
  if (lastName.length < 3) return next(new AppError('Last name is Too short', 401))
  if (firstName.length > 16) return next(new AppError('First name is Too long', 401))
  if (lastName.length > 16) return next(new AppError('Last name is Too long', 401))
  if (!email) return next(new AppError('Email required', 401))

  //4) update password
  if (user.firstName !== firstName) user.firstName = firstName
  if (user.lastName !== lastName) user.lastName = lastName
  if (user.email !== email) {
    user.email = email
    user.emailConfig = false
  }
  if (userImg) user.img = userImg
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