// create function and export it to pages.js
const Event = require("../models/products");
exports.homePageFunction = (req, res) => {
  Event.find({}, (err, products) => {
    res.render("index", { products: products, title: "Cera" });
  });
};
exports.shopPageFunction = (req, res) => {
  Event.find({}, (err, productsData) => {
    let products = [];
    let productsSize = 8;
    for (let i = 0; i < productsData.length; i += productsSize) {
      products.push(productsData.slice(i, productsSize + i));
    }
    res.render("shop", { products: products, title: "Cera Shop" })
  });
};
exports.aboutPageFunction = (req, res) => {
  res.render("about", { title: "About Us" });
};
exports.paymentPageFunction = (req, res) => {
  res.render("payment", { title: "Payment" });
};
exports.contactPageFunction = (req, res) => {
  res.render("contact", { title: "Contact Us" });
};
exports.blogPageFunction = (req, res) => {
  res.render("blog", { title: "Cera Blog" });
};
exports.registrationPageFunction = (req, res) => {
  res.render("user/registration", { title: "Log In" });
};
exports.createAccountPageFunction = (req, res) => {
  res.render("user/createAccount", { title: "Sin Up" });
};
exports.singleProdFun = (req, res) => {
  Event.find({ _id: req.params.id, }, (err, product) => {
    Event.find({ stoked: true }, (err, productsData) => {
      let products = [];
      let productsSize = 8;
      for (let i = 0; i < productsData.length / 2; i += productsSize) {
        products.push(productsData.slice(i, productsSize + i));
      }
      res.render("product", { title: "Product", product: product[0], products: products });
    })
  });
  ;
}

exports.notFoundPage = (req, res) => {
  res.status(404).render('404', { title: '404' });
}