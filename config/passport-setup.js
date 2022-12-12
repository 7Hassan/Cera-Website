const passport = require('passport');
const localStrategy = require('passport-local').Strategy
const User = require('../models/users');


// Saving user in the session

passport.use('local.signup', new localStrategy({
  firstName: 'firstName',
  lastName: 'lastName',
  email: 'email',
  password: 'password',
  passReqToCallback: true,
}, (req, firstName, lastName, email, password, done) => {
  console.log(req.body)
}))










