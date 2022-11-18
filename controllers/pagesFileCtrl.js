// create function and export it to pages.js
exports.homePageFunction = (req, res) => {
  res.render("index"); // send the rendered view to the client
};
exports.shopPageFunction = (req, res) => {
  res.render("shop");
};
exports.aboutPageFunction = (req, res) => {
  res.render("about");
};
exports.paymentPageFunction = (req, res) => {
  res.render("payment");
};
exports.contactPageFunction = (req, res) => {
  res.render("contact");
};
exports.blogPageFunction = (req, res) => {
  res.render("blog");
};
exports.registrationPageFunction = (req, res) => {
  res.render("registration");
};
exports.createAccountPageFunction = (req, res) => {
  res.render("createAccount");
};
