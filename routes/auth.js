const express = require('express')
const Router = express.Router()
const func = require('../controller/auth')

Router.route('/signup/check').patch(func.checkEmail)
Router.route('/signup/verify').get(func.isEmailConfig, func.verifyPage).post(func.isEmailConfig, func.changEmailVerify).patch(func.isEmailConfig, func.resendEmailVerify)
Router.route('/signup/verify/:token').get(func.verify)

// isn't logged
Router.use(func.checkAuth)
Router.route('/signup').get(func.signPage).post(func.signUp)
Router.route('/login').get(func.logPage).post(func.logIn).patch(func.forgetPass)
Router.route('/resetpassword/:token').get(func.protect, func.resetPage).post(func.protect, func.resetPassword)
module.exports = Router