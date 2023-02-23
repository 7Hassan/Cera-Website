const Product = require('../models/products');

exports.homePage = (req, res) => {
  Product.find({}, (err, products) => {
    res.render('pages/index', {
      products: products,
      title: 'Cera',
      errors: req.flash('errors'),
      warning: req.flash('warning'),
      success: req.flash('success'),
      toast: req.flash('toast'),
    });
  });
};
exports.shopPage = (req, res) => {
  Product.find({}, (err, productsData) => {
    let products = [];
    let productsSize = 8;
    for (let i = 0; i < productsData.length; i += productsSize) {
      products.push(productsData.slice(i, productsSize + i));
    }
    res.render('pages/shop', { products: products, title: 'Cera-Shop' })
  });
};

exports.singleProd = (req, res) => {
  Product.find({ _id: req.params.id }, (error, product) => {
    Product.find({ stoked: true }, (err, productsData) => {
      let products = [];
      let productsSize = 8;
      for (let i = 0; i < productsData.length / 2; i += productsSize) {
        products.push(productsData.slice(i, productsSize + i));
      }
      res.render('pages/product', { title: 'Product', product: product[0], products: products });
    })
  });
  
}

exports.aboutPage = (req, res) => res.render('pages/about', { title: 'About Us' })
exports.paymentPage = (req, res) => res.render('pages/payment', { title: 'Payment' })
exports.contactPage = (req, res) => res.render('pages/contact', { title: 'Contact Us' })
exports.blogPage = (req, res) => res.render('pages/blog', { title: 'Cera-Blog' });
exports.notFoundPage = (req, res) => res.status(404).render('pages/404', { title: '404' })