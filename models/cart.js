const mongoose = require('mongoose')
const AppError = require('../Errors/classError')

const cartSchema = new mongoose.Schema({
  products: [{
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'products'
    },
    count: {
      type: Number,
      required: [true, 'Count is required'],
      max: [9, 'The amount is limited '],
      min: [1, 'The amount isn\'t match ']
    },
    size: {
      type: String,
      required: [true, 'Size is required'],
      enum: ['XL', 'L', 'M', 'S'],
    }
  }],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'users'
  }
},
  //? to activate virtuals
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

//? get user linked with this cart
cartSchema.virtual('author', {
  ref: 'users',
  localField: 'user',
  foreignField: '_id',
  justOne: true
})

cartSchema.pre(/^find/, async function () {
  this.select("-__v").populate({ path: 'products.product', select: "-__v" })
  // this.select("-__v").populate({ path: 'user', select: "-__v" })
})


let Cart = mongoose.model('carts', cartSchema)
module.exports = Cart