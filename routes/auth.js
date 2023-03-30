const express = require('express')
const Router = express.Router()
const func = require('../controller/auth')



Router.route('/signup/check').patch(func.checkEmail)
// logged
Router.route('/logout').post(func.logOut)
Router.route('/signup/verify').get(func.isEmailConfig, func.verifyPage).post(func.isEmailConfig, func.changEmailVerify).patch(func.isEmailConfig, func.resendEmail)
Router.route('/signup/verify').get(func.isEmailConfig, func.verifyPage)
Router.route('/signup/verify/:token').get(func.verify)

// isn't logged
// Router.use(func.checkAuth)
Router.route('/signup').get(func.signPage).post(func.signUp)
Router.route('/login').get(func.logPage).post(func.logIn)
Router.route('/forgetPassword').get(func.forgetPage).post(func.forgetPass)
Router.route('/forgetPassword/:token').patch(func.resetPass)
module.exports = Router