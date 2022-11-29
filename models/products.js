const mongoose = require('mongoose')
const productSchema = new mongoose.Schema({
  stoked: {
    type: Boolean,
    require: true,
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



let Event = mongoose.model("Event", productSchema, "products");
module.exports = Event;