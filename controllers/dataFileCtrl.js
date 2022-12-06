
exports.getDataFunction = (req, res) => {
  try {
    const User = require("../models/products");
    User.find({}, (err, products) => res.json({ products: products }));
  } catch (err) {
    console.log(err);
  }
};



