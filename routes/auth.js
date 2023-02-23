const express = require('express');
const Router = express.Router();
const func = require('../controller/auth');

Router.route('/signup').get(func.checkUser, func.createAccountPage).post(func.signUp)
Router.route('/login').get(func.checkUser, func.registrationPage).post(func.logIn)
Router.route('/signup/verify').get(func.verificationPage).post(func.changEmailVerify)
Router.route('/signup/verify/:emailActivationCode').get(func.confirmationEmail, func.verificationPage);
Router.post('/signup/check', func.checkEmail);

module.exports = Router;