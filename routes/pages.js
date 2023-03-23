const express = require('express')
const Router = express.Router()
const func = require('../controller/pages')
const protect = require('../controller/auth')

Router.use(protect.isLogIn)
Router.route('/').get(func.homePage)
Router.route('/me').get(protect.isUser, func.settingPage)
Router.route('/shop').get(func.shopPage)
Router.route('/shop/:id').get(func.singleProd);
Router.route('/about').get(func.aboutPage)
Router.route('/payment').get(func.paymentPage)
Router.route('/contact').get(func.contactPage)
Router.route('/blog').get(func.blogPage)

//Router.route('/*').get(func.notFoundPage)

module.exports = Router
