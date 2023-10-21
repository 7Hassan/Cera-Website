const express = require('express')
const limitReq = require('express-rate-limit')
const Router = express.Router()
const func = require('../controller/auth')
const limiter = limitReq({
  max: 3, windowMs: 1000 * 60 * 60,
  message: 'Too many requests,try again after one hour'
})

Router.route('/signup/check').patch(func.checkEmail)
Router.route('/signup/verify').get(func.isEmailConfig, func.verifyPage).post(func.isEmailConfig, limiter, func.changEmailVerify).patch(func.isEmailConfig, limiter, func.resendEmailVerify)
Router.route('/signup/verify/:token').get(func.verify)

// isn't logged
Router.use(func.checkAuth)
Router.route('/signup').get(func.signPage).post(func.signUp)
Router.route('/login').get(func.logPage).post(func.logIn).patch(limiter, func.forgetPass)
Router.route('/resetpassword/:token').get(func.protect, func.resetPage).post(func.protect, func.resetPassword)
module.exports = Router