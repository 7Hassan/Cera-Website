const Product = require('../models/products');
const catchError = require('../Errors/catch')

exports.homePage = catchError(async (req, res) => {
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

exports.shopPage = catchError(async (req, res) => {
  let result = await Product.find()
  result = result.sort((a, b) => (a.name < b.name) ? 1 : -1)
  res.render('pages/shop', { products: sliceDataShop(result, 8), title: 'Cera-Shop' })
})

exports.singleProd = catchError(async (req, res) => {
  const singleProduct = await Product.findOne({ _id: req.params.id })
  let result = await Product.find({ stoked: true, name: singleProduct.name })
  result = result.sort((a, b) => (a.price < b.price) ? 1 : -1)
  res.render('pages/product', { title: 'Product', product: singleProduct, products: result });
})

exports.aboutPage = catchError((req, res) => res.render('pages/about', { title: 'About Us' }))
exports.paymentPage = catchError((req, res) => res.render('pages/payment', { title: 'Payment' }))
exports.contactPage = catchError((req, res) => res.render('pages/contact', { title: 'Contact Us' }))
exports.blogPage = catchError((req, res) => res.render('pages/blog', { title: 'Cera-Blog' }))
exports.notFoundPage = catchError((req, res) => res.status(404).render('pages/404', { title: '404' }))




//! To slice data to show it in a shop page
function sliceDataShop(data, length) {
  let products = []
  for (let i = 0; i < data.length; i += length) products.push(data.slice(i, length + i))
  return products
}