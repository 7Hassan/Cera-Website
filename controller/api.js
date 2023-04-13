const Product = require('../models/products')
const catchError = require('../Errors/catch')

exports.allProducts = catchError(async (req, res, next) => res.status(200).send(await Product.find({})))
exports.oneProducts = catchError(async (req, res, next) => {
  const data = await Product.findOne({ '_id': req.params.id })
  res.status(200).send(data)
})