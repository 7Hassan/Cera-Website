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
  res.render("user/createAccount", { title: "Sin Up" });
};

exports.verificationPage = (req, res) => {

  if (req.session.user && req.cookies.user_side) {
    if (req.session.user.emailConf) {
      req.flash('toast', 'You are Registered');
      res.redirect("/");
    } else {
      User.find({ _id: req.session.user.userId }, (err, user) => {
        res.render("user/verification", {
          title: "Verify your email",
          email: user[0].email,
          errors: req.flash('errors'),
          warning: req.flash('warning'),
          success: req.flash('success'),
          toast: req.flash('toast'),
        });
      });
    }

  } else {
    req.flash('toast', 'You are Registered');
    res.redirect('/auth/sinup');
  }
}


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
            emailConf: false,
            img: '',
            carteData: [],
            emailActivationCode: token,
          }
          res.redirect("/auth/sinup/verify");

          sendConfirmationEmail(user.email, req.session.user.emailActivationCode, user.firstName);
        })
        .catch(err => console.log(err));
    }))
};



exports.changEmailVerify = (req, res) => {
  const newEmail = req.body.newEamil;
  User.findOne({ _id: req.session.user.userId }, (err, userExist) => {
    if (err) return console.log(err);
    if (!req.session.user.emailConf) {
      if (validator.isEmail(newEmail)) {
        User.findOne({ email: newEmail }, (err, user) => {
          if (!user) {
            User.updateOne({ _id: req.session.user.userId }, { email: newEmail }, (err) => {
              if (err) return console.log(err)
              req.flash('success', 'Email updated')
              sendConfirmationEmail(newEmail, req.session.user.emailActivationCode, userExist.firstName);
              res.redirect('/auth/sinup/verify')
            })
          } else {
            req.flash('errors', 'This email is already in use !')
            res.redirect('/auth/sinup/verify');
          }
        })
      } else {
        req.flash('errors', 'Please enter a valid email !')
        res.redirect('/auth/sinup/verify');
      }
    } else {
      req.flash('toast', 'You are Registered')
      res.redirect("/")
    }
  })
}


exports.confirmationEmail = (req, res, next) => {
  if (req.session.user.emailActivationCode == req.params.emailActivationCode) {
    req.session.user.emailConf = true;
    console.log(req.session.user);
    req.flash('success', 'Registration Successed');
    res.redirect("/");
    next();

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



// Check functions

exports.checkUser = (req, res, next) => {
  if (req.session.user && req.cookies.user_side) {
    if (req.session.user.emailConf) {
      req.flash('toast', 'You are Registered');
      res.redirect("/");
    } else {
      req.flash('toast', 'Please verify your email to proceed')
      res.redirect('/auth/sinup/verify');
    }
  } else {
    next();
  }
}


exports.checkEmail = (req, res) => {
  const { emailValidation } = req.body;
  User.findOne({ email: emailValidation }, (err, emailReq) =>
    (!emailReq) ? res.status(200).json({ res: true }) : res.status(200).json({ res: false }));
};





