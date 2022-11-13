const { productsData } = require("../Data.js");

exports.getDataFunction = (req, res) => {
  try {
    res.json({
      products: productsData,
    });
  } catch (error) {
    console.log(error);
  }
};
