// create function and export it to pages.js
exports.homePageFunction = (req, res) => {
  const Event = require("../models/products");
  Event.find({}, (err, products) => {
    res.render("index", { products: products, title: "Cera" }); // send the rendered view to the client
  })
};
exports.shopPageFunction = (req, res) => {
  const Event = require("../models/products");
  Event.find({}, (err, products) => {
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
