const express = require("express");
const bcrypt = require('bcryptjs');
const User = require('../models/users');


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


  res.render("user/verification", { title: "Verify your email", email: "email" });
};


/* Post */
exports.signUp = (req, res) => {
  console.log(req.body);
  const user = new User(req.body);
  // hash password
  bcrypt.genSalt(10, (err, salt) =>
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) throw err;
      // set password hashed
      user.password = hash;
      user.save()
        .then(user => res.redirect("/users/sinup/verify"))
        .catch(err => console.log(err));
    }))
};


exports.changEmailVerify = (req, res) => {
  console.log(req.body)
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
