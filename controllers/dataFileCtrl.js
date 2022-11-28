
exports.getDataFunction = (req, res) => {
  try {
    const Event = require("../models/products");
    Event.find({}, (err, products) => res.json({ products: products }));
  } catch (err) {
    console.log(err);
  }
};



