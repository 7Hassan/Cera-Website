const express = require('express')
const func = require('../controller/api')
const Router = express.Router()

Router.route('/products').get(func.allProducts)
Router.route('/products/:id').get(func.oneProducts)

module.exports = Router