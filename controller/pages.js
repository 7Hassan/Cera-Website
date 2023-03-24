const Product = require('../models/products');
const catchError = require('../Errors/catch')

exports.aboutPage = (req, res) => res.render('pages/about', pageObject('About Us', req))
exports.paymentPage = (req, res) => res.render('pages/payment', pageObject('Payment', req))
exports.contactPage = (req, res) => res.render('pages/contact', pageObject('Contact Us', req))
exports.blogPage = (req, res) => res.render('pages/blog', pageObject('Blog', req))
exports.notFoundPage = (req, res) => res.status(404).render('pages/404', pageObject('404', req))
exports.settingPage = (req, res, next) => res.render('pages/setting', pageObject('Cera | Account', req))

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
    products: sliceDataShop(result, 8),
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



//! To slice data to show it in a shop page
function sliceDataShop(data, length) {
  let products = []
  for (let i = 0; i < data.length; i += length) products.push(data.slice(i, length + i))
  return products
}

function pageObject(title, req) {
  return {
    title: title,
    errors: req.flash('errors'),
    warning: req.flash('warning'),
    success: req.flash('success'),
    toast: req.flash('toast'),
  }
}
