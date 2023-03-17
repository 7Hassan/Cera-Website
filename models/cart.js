const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
  products: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'products'
    }
  ]
},
//? to activate virtuals
  {
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true }
  }
)

//? get user linked with this cart
cartSchema.virtual('user', {
  ref: 'users',
  foreignField: 'cart',
  localField: '_id'
})


let Cart = mongoose.model('carts', cartSchema)
module.exports = Cart