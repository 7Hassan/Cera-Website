db = require("../config/dataBase")
const Event = require("../models/products");
const { productsData } = require("../Data.js");
productsData.forEach((product) => {
  let prod = new Event(product);
  prod.save((err) => {
    if (err) {
      console.log("not save product:" + err);
    } else {
      console.log("save product");
    }
  });
})





