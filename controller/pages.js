const Product = require('../models/products');
const catchError = require('../Errors/catch')

exports.homePage = catchError(async (req, res) => {
  res.render('pages/index', {
    title: 'Cera',
    featureProd: await Product.find({ stoked: false }),
    newProd: await Product.find({ new: true }),
    errors: req.flash('errors'),
    warning: req.flash('warning'),
    success: req.flash('success'),
    toast: req.flash('toast'),
  })
})

exports.shopPage = catchError(async (req, res) => {
  let result = await Product.find().sort({ "name": -1 })
  res.render('pages/shop', {
    title: 'Cera | Shop',
    products: sliceDataShop(result, 8),
    errors: req.flash('errors'),
    warning: req.flash('warning'),
    success: req.flash('success'),
    toast: req.flash('toast'),
  })
})

exports.singleProd = catchError(async (req, res) => {
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

exports.aboutPage = (req, res) => res.render('pages/about', {
  title: 'About Us',
  errors: req.flash('errors'),
  warning: req.flash('warning'),
  success: req.flash('success'),
  toast: req.flash('toast'),
})

exports.paymentPage = catchError(async (req, res) => res.render('pages/payment', {
  title: 'Payment',
  errors: req.flash('errors'),
  warning: req.flash('warning'),
  success: req.flash('success'),
  toast: req.flash('toast'),
}))
exports.contactPage = catchError(async (req, res) => res.render('pages/contact', {
  title: 'Contact Us',
  errors: req.flash('errors'),
  warning: req.flash('warning'),
  success: req.flash('success'),
  toast: req.flash('toast'),
}))
exports.blogPage = (req, res) => res.render('pages/blog', {
  title: 'Cera-Blog', errors: req.flash('errors'),
  warning: req.flash('warning'),
  success: req.flash('success'),
  toast: req.flash('toast'),
})
exports.notFoundPage = (req, res) => res.status(404).render('pages/404', {
  title: '404', errors: req.flash('errors'),
  warning: req.flash('warning'),
  success: req.flash('success'),
  toast: req.flash('toast'),
})




//! To slice data to show it in a shop page
function sliceDataShop(data, length) {
  let products = []
  for (let i = 0; i < data.length; i += length) products.push(data.slice(i, length + i))
  return products
}