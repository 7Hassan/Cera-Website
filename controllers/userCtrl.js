const express = require("express");
const bcrypt = require('bcryptjs');
const User = require('../models/users');
const { sendConfirmationEmail } = require('./nodemailer')
const validator = require('validator');
const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';




/* Get */
exports.registrationPageFunction = (req, res) => {
  let errors = { email: '', password: '' };
  res.render("user/registration", { title: "Log In", errors });
};
exports.createAccountPageFunction = (req, res) => {
  let errors = { email: '' };
  res.render("user/createAccount", { title: "Sin Up", errors });
};

exports.checkEmail = (req, res) => {
  const { emailValidation } = req.body;

  User.findOne({ email: emailValidation }, (err, emailReq) =>
    (!emailReq) ? res.status(200).json({ res: true }) : res.status(200).json({ res: false }));
};


exports.verification = (req, res) => {
  User.find({ _id: req.session.user.userId }, (err, user) => {
    res.render("user/verification", {
      title: "Verify your email",
      email: user[0].email,
      errors: req.flash('errors'),
      success: req.flash('success'),
    });
  });
};


/* Post */
exports.signUp = (req, res) => {
  const user = new User(req.body);

  // set active code
  let token = "";
  for (let i = 0; i < 25; i++) token += characters[Math.floor(Math.random() * characters.length)];

  // hash password
  bcrypt.genSalt(10, (err, salt) =>
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) throw err;
      // set password hashed
      user.password = hash;
      user.save()
        .then(user => {
          req.session.user = {
            userId: user._id,
            img: '',
            carteData: [],
            emailActivationCode: token,
          }
          res.redirect("/users/sinup/verify")

          // sendConfirmationEmail()

        })
        .catch(err => console.log(err));
    }))
};



exports.changEmailVerify = (req, res) => {
  const newEmail = req.body.newEamil;
  if (validator.isEmail(newEmail)) {
    User.findOne({ email: newEmail }, (err, user) => {
      if (!user) {
        User.updateOne({ _id: req.session.user.userId }, { email: newEmail }, (err) => {
          if (err) console.log(err)
          req.flash('success', 'Email updated')
          res.redirect('/users/sinup/verify')
        })

      } else {
        req.flash('errors', 'This email is already in use !')
        res.redirect('/users/sinup/verify');
      }

    })
  } else {
    req.flash('errors', 'Please enter a valid email !')
    res.redirect('/users/sinup/verify');
    sendConfirmationEmail()
  }
};


exports.confirmationEmail = (req, res) => {

  if (req.session.user.emailActivationCode == req.params.emailActivationCode) {
    res.redirect("/");
  }

}













exports.logIn = (req, res) => {
  let errors = { email: '', password: '' };
  const { userEmail, userPassword } = req.body;
  User.findOne({ email: userEmail }, (err, user) => {
    if (!user) {
      errors.email = "Oops! Email is incorrect.";
      res.render("user/registration", { title: "Log In", errors });

    } else {
      bcrypt.compare(userPassword, user.password).then((same) => {
        if (same) {
          req.session.userId = user._id;
          res.redirect('/');
        } else {
          errors.password = "Oops! Password is incorrect.";
          res.render("user/registration", { title: "Log In", errors });
        }

      });
    }
  })


}
