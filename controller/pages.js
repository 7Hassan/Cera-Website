const User = require('../models/users')
const Product = require('../models/products')
const catchError = require('../Errors/catch')
const helper = require('./helperFunc')
const sharp = require('sharp')
const AppError = require('../Errors/classError')
const { initializeApp } = require("firebase/app");
const { getStorage, uploadBytes } = require("firebase/storage");
const { getDownloadURL, ref } = require('firebase/storage');


const firebaseConfig = {
  apiKey: process.env.ApiKey,
  authDomain: process.env.AuthDomain,
  projectId: process.env.ProjectId,
  storageBucket: process.env.StorageBucket,
  messagingSenderId: process.env.MessagingSenderId,
  appId: process.env.AppId
};
const fireBaseApp = initializeApp(firebaseConfig);
const storage = getStorage(fireBaseApp)

exports.aboutPage = (req, res) => res.render('pages/about', helper.pageObject('Cera | About', req))
exports.paymentPage = (req, res) => res.render('pages/payment', helper.pageObject('Cera | Payment', req))
exports.contactPage = (req, res) => res.render('pages/contact', helper.pageObject('Cera | Contact Us', req))
exports.blogPage = (req, res) => res.render('pages/blog', helper.pageObject('Cera | Blog', req))
exports.notFoundPage = (req, res) => res.status(404).render('pages/404', helper.pageObject('404', req))
exports.settingPage = (req, res, next) => res.render('pages/setting', helper.pageObject('Cera | Account', req))
exports.homePage = catchError(async (req, res, next) =>
  res.render('index', {
    featureProd: await Product.find({ stoked: false }),
    newProd: await Product.find({ new: true, stoked: true }),
    title: 'Cera',
    errors: req.flash('errors'),
    warning: req.flash('warning'),
    success: req.flash('success'),
    toast: req.flash('toast'),
  }))

exports.shopPage = catchError(async (req, res, next) => {
  let result = await Product.find({ stoked: true }).sort({ "name": -1 })
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
  let otherProducts = await Product.find({ _id: { $ne: req.params.id }, name: singleProduct.name, stoked: true, new: false }).sort({ "price": -1 })
  res.render('pages/product', {
    title: 'Product',
    product: singleProduct,
    products: otherProducts,
    errors: req.flash('errors'),
    warning: req.flash('warning'),
    success: req.flash('success'),
    toast: req.flash('toast'),
  });
})


exports.userData = catchError(async (req, res, next) => {
  const { user, time } = await helper.testJwtToken(req, res, next)
  res.locals.user = ''
  if (!user || user.isChangedPass(time)) return next()
  res.locals.user = user
  req.user = user
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

exports.logOut = catchError(async (req, res, next) => {
  const user = req.user
  const data = req.body.data
  if (data != 'logOut' || !user) return next(new AppError('You aren\'t register', 401))
  res.cookie('jwt', 'out', { expires: new Date(Date.now() + 1_000_0), httpOnly: true })
  res.status(200).json({ redirect: '/' })
})




exports.upload = helper.upload.single('userImg')

exports.resizeImg = catchError(async (req, res, next) => {
  const img = req.file;
  if (!img) return next()
  const imageBuffer = await sharp(img.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toBuffer();

  const imgUrl = `/users/user-img-${req.user.id}-${Date.now()}.jpeg`
  const imgRef = ref(storage, imgUrl);
  const imgBytes = new Uint8Array(imageBuffer);
  await uploadBytes(imgRef, imgBytes, { contentType: 'image/jpeg' });
  const url = await getDownloadURL(imgRef);
  req.file.filename = url
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

exports.addProduct = catchError(async (req, res, next) => {
  const { count, size, productId } = req.body
  const user = req.user
  const cart = user.cart
  const product = await Product.findById(productId)
  if (!product) return next(new AppError('Product not found', 401))
  const index = cart.products.findIndex((obj) => obj.product.id == productId)
  if (index !== -1) return next(new AppError('Product is in a Cart', 400))
  cart.products.push({ product: product._id, count: count, size: size })
  await cart.save()
  res.status(200).send(product)
})
exports.updateCart = catchError(async (req, res, next) => {
  const { count, size, productId } = req.body
  const user = req.user
  const cart = user.cart
  const index = cart.products.findIndex((obj) => obj.product.id == productId)
  if (index === -1) return next(new AppError('Product isn\'t in a Cart', 400))
  cart.products[index].count = count
  cart.products[index].size = size
  await cart.save()
  res.status(200).json({ count: cart.products[index].count, size: cart.products[index].size })
})

exports.loveProduct = catchError(async (req, res, next) => {
  const { productId } = req.body
  const user = req.user
  const cart = user.cart
  const product = await Product.findById(productId)
  if (!product) return next(new AppError('Product not found', 401))
  const index = cart.loves.findIndex((obj) => obj.id == productId)
  if (index !== -1) return next(new AppError('Product is in love list', 400))
  cart.loves.push(product._id)
  await cart.save()
  res.status(200).send('add')
})

exports.removeProduct = catchError(async (req, res, next) => {
  const { id, name } = req.body
  const user = req.user
  const cart = user.cart
  if (name == 'cart') {
    const index = cart.products.findIndex((obj) => obj.product.id == id)
    if (index == -1) return next(new AppError('Product not found', 401))
    cart.products.splice(index, 1)
  } else if (name == 'loves') {
    const index = cart.loves.findIndex((obj) => obj.id == id)
    if (index == -1) return next(new AppError('Product not found', 401))
    cart.loves.splice(index, 1)
  } else return res.status(401).send('failed')
  await cart.save()
  res.status(200).send('success')
})
