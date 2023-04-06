const express = require('express')
const Router = express.Router()
const func = require('../controller/pages')
// const authFunc = require('../controller/auth')


Router.use(func.userData)
Router.route('/').get(func.homePage).post(func.logOut)
Router.route('/shop').get(func.shopPage)
Router.route('/shop/:id').get(func.singleProd).post(func.isUser, func.addProduct).delete(func.isUser, func.removeProduct)
Router.route('/about').get(func.aboutPage)
Router.route('/payment').get(func.isUser, func.paymentPage)
Router.route('/contact').get(func.contactPage)
Router.route('/blog').get(func.blogPage)
Router.route('/me').get(func.isUser, func.settingPage)
Router.route('/me/updateUser').post(func.isUser, func.upload, func.resizeImg, func.updateUserData)
Router.route('/me/updatePass').post(func.isUser, func.updatePassword)

// Router.route('/*').get(func.notFoundPage)

module.exports = Router


