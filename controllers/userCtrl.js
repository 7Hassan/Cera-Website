const express = require("express");
const bcrypt = require('bcryptjs');
const User = require('../models/users');





exports.signUp = (req, res) => {
  let errors = { email: '' };
  const { firstName, lastName, email, password, country } = req.body;
  User.findOne({ email }, (err, emailReq) => {
    if (!emailReq) {
      const user = new User({ firstName, lastName, email, password, country });
      // hash password
      bcrypt.genSalt(10, (err, salt) =>
        bcrypt.hash(user.password, salt, (err, hash) => {
          if (err) throw err;
          // set password hashed
          user.password = hash;
          user.save()
            .then(user => {
              req.flash("success_msg", "You are registered")
              res.redirect('/users/login')
            })
            .catch(err => console.log(err));
        }))
    } else {
      errors.email = "Email is exist, Please Log In";
      res.render("user/createAccount", { title: "Sin Up", errors });
    }
  });
};
















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
