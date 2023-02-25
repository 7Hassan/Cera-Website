const Product = require('../models/products')

exports.allProducts = async (req, res) => {
  try {
    const data = await Product.find({})
    res.status(200).send(data)
  } catch (err) {
    res.status(404).send('[]')
  }
}
exports.oneProducts = async (req, res) => {
  try {
    const data = await Product.findOne({ '_id': req.params.id })
    res.status(200).send(data)

  } catch (err) {
    res.status(404).send('[]')
  }

}