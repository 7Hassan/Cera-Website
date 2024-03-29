const mongoose = require('mongoose')
const productSchema = new mongoose.Schema({
  stoked: {
    type: Boolean,
    require: true,
  },
  new: {
    type: Boolean,
    default: false,
  },
  imgSrc: {
    type: String,
    require: true,
  },
  imgs: {
    type: Array,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  stars: {
    type: Number,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
});



let Product = mongoose.model('products', productSchema);
module.exports = Product;