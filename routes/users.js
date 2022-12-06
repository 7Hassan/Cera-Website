const express = require("express");
db = require("../config/dataBase")
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/users');
// const passport = require('passport')
const path = "../controllers/pagesFileCtrl";
const {
  registrationPageFunction,
  createAccountPageFunction,
} = require(path);

router.get("/sinup", createAccountPageFunction);

router.post("/sinup", (req, res) => {
  // const password = req.body.password;

  let user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    country: req.body.country,
    carte: [],
    date: Date.now(),
  });
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { console.log("genSalt:" + err) };

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) { console.log("hash:" + err) };
      user.password = hash;
    })

    user.save((err) => {
      if (err) {
        console.log("not saved:" + err);
      } else {
        console.log("user saved");
        res.redirect('/users/login');
      }
    })
  })
});

router.get("/login", registrationPageFunction);
router.post("/login", (req, res) => {
  console.log(req.body);
});





module.exports = router;