const express = require('express')
const Router = express.Router()
const func = require('../controller/auth')

Router.route('/signup/check').patch(func.checkEmail)
// logged
Router.route('/logout').post(func.isUser, func.logOut)
Router.route('/updateUser').post(func.isUser, func.updateUserData)
Router.route('/updatePass').post(func.isUser, func.updatePassword)
// isn't logged
Router.use(func.checkAuth)
Router.route('/signup').get(func.signPage).post(func.signUp)
Router.route('/login').get(func.logPage).post(func.logIn)
Router.route('/forgetPassword').get(func.forgetPage).post(func.forgetPass)
Router.route('/forgetPassword/:token').patch(func.resetPass)
Router.route('/signup/verify').get(func.verifyPage).post(func.changEmailVerify)
Router.route('/signup/verify/:token').get(func.confirmationEmail, func.verifyPage);
module.exports = Router