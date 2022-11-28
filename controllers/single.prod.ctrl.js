exports.singleProdFun = (req, res) => {
  const Event = require("../models/products");
  Event.find({ _id: req.params.id }, (err, product) => {
    Event.find({}, (err, products) => {
      res.render("shop/product", { product: product[0], products: products });
    })
  });
  ;
}