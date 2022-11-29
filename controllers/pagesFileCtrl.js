// create function and export it to pages.js
exports.homePageFunction = (req, res) => {
  const Event = require("../models/products");
  Event.find({}, (err, products) => {
    res.render("index", { products: products, title: "Cera" }); // send the rendered view to the client
  })
};
exports.shopPageFunction = (req, res) => {
  const Event = require("../models/products");
  Event.find({}, (err, productsData) => {
    let products = [];
    let productsSize = 8;
    for (let i = 0; i < productsData.length; i += productsSize) {
      products.push(productsData.slice(i, productsSize + i));
    }
    // res.json(products);
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
  res.render("registration", { title: "Log In" });
};
exports.createAccountPageFunction = (req, res) => {
  res.render("createAccount", { title: "Sin Up" });
};
exports.singleProdFun = (req, res) => {
  const Event = require("../models/products");
  Event.find({ _id: req.params.id }, (err, product) => {
    Event.find({}, (err, products) => {
      res.render("product", { title: "Product", product: product[0], products: products });
    })
  });
  ;
}