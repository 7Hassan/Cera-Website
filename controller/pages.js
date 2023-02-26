const Product = require('../models/products');

exports.homePage = async (req, res) => {

  try {
    const featureProd = await Product.find({ stoked: false })
    const newProd = await Product.find({ stoked: false })
    res.render('pages/index', {
      featureProd: featureProd,
      newProd: newProd,
      title: 'Cera',
      errors: req.flash('errors'),
      warning: req.flash('warning'),
      success: req.flash('success'),
      toast: req.flash('toast'),
    })
  } catch (err) {
    console.log('🚀 ~ file: pages.js:25 ~ exports.homePage= ~ err:', err)
  }
}

exports.shopPage = async (req, res) => {
  try {
    let result = await Product.find()
    result = result.sort((a, b) => (a.name < b.name) ? 1 : -1)
    const data = sliceDataShop(result, 8)
    res.render('pages/shop', { products: data, title: 'Cera-Shop' })
  } catch (err) {
    console.log('🚀 ~ file: pages.js:29 ~ exports.shopPage= ~ err:', err)
    res.render('pages/shop', { products: [], title: 'Cera-Shop' })
  }
};

exports.singleProd = async (req, res) => {
  try {
    const singleProduct = await Product.findOne({ _id: req.params.id })
    let result = await Product.find({ stoked: true, name: singleProduct.name })
    result = result.sort((a, b) => (a.price < b.price) ? 1 : -1)
    res.render('pages/product', { title: 'Product', product: singleProduct, products: result });
  } catch (err) {
    console.log('🚀 ~ file: pages.js:38 ~ exports.singleProd= ~ err:', err)
    res.render('pages/product', { title: 'Product', product: {}, products: [] })
  }
}

exports.aboutPage = (req, res) => res.render('pages/about', { title: 'About Us' })
exports.paymentPage = (req, res) => res.render('pages/payment', { title: 'Payment' })
exports.contactPage = (req, res) => res.render('pages/contact', { title: 'Contact Us' })
exports.blogPage = (req, res) => res.render('pages/blog', { title: 'Cera-Blog' });
exports.notFoundPage = (req, res) => res.status(404).render('pages/404', { title: '404' })




//! To slice data to show it in a shop page
function sliceDataShop(data, length) {
  let products = []
  for (let i = 0; i < data.length; i += length) products.push(data.slice(i, length + i))
  return products
}