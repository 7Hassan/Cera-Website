const User = require('../models/users')
const bcrypt = require('bcryptjs')
const { sendConfirmationEmail } = require('./emailSender')
const { catchError } = require('../Errors/catch')
const validator = require('validator');
const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';




/* Get */
exports.registrationPage = (req, res) => {
  let errors = { email: '', password: '' };
  res.render('user/registration', { title: 'Log In', errors });
};

exports.createAccountPage = (req, res) => res.render('user/createAccount', { title: 'Sign Up' })

exports.verificationPage = (req, res) => {

  if (req.session.user && req.cookies.user_side) {
    if (req.session.user.emailConf) {
      req.flash('toast', 'You are Registered');
      res.redirect('/');
    } else {
      User.find({ _id: req.session.user.userId }, (err, user) => {
        res.render('user/verification', {
          title: 'Verify your email',
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
    res.redirect('/auth/signup');
  }
}


/* Post */
exports.signUp = catchError(async (req, res) => {
  const result = await User.create(req.body)
  res.status(201).send('user created')
})


// // set active code
// let token = '';
// for (let i = 0; i < 25; i++) token += characters[Math.floor(Math.random() * characters.length)];

// // hash password
// bcrypt.genSalt(10, (er, salt) =>
//   bcrypt.hash(user.password, salt, (err, hash) => {
//     if (err) throw err;
//     // set password hashed
//     newUser.password = hash;
//     newUser.save()
//       .then(user => {
//         req.session.user = {
//           userId: user._id,
//           emailConf: false,
//           img: '',
//           carteData: [],
//           emailActivationCode: token,
//         }
//         res.redirect('/auth/signup/verify');

//         sendConfirmationEmail(user.email, req.session.user.emailActivationCode, user.firstName);
//       }).catch(error => console.log(error));
//   }))
// }



exports.changEmailVerify = (req, res) => {
  const newEmail = req.body.newEamil;
  User.findOne({ _id: req.session.user.userId }, (err, userExist) => {
    if (err) return console.log(err);
    if (!req.session.user.emailConf) {
      if (validator.isEmail(newEmail)) {
        User.findOne({ email: newEmail }, (error, user) => {
          if (!user || error) {
            User.updateOne({ _id: req.session.user.userId }, { email: newEmail }, (er) => {
              if (er) return console.log(er)
              req.flash('success', 'Email updated')
              sendConfirmationEmail(newEmail, req.session.user.emailActivationCode, userExist.firstName);
              res.redirect('/auth/signup/verify')
            })
          } else {
            req.flash('errors', 'This email is already in use !')
            res.redirect('/auth/signup/verify');
          }
        })
      } else {
        req.flash('errors', 'Please enter a valid email !')
        res.redirect('/auth/signup/verify');
      }
    } else {
      req.flash('toast', 'You are Registered')
      res.redirect('/')
    }
  })
}


exports.confirmationEmail = (req, res, next) => {
  if (req.session.user.emailActivationCode == req.params.emailActivationCode) {
    req.session.user.emailConf = true;
    console.log(req.session.user);
    req.flash('success', 'Registration Successes');
    res.redirect('/');
    next();

  }
}



exports.logIn = (req, res) => {
  let errors = { email: '', password: '' };
  const { userEmail, userPassword } = req.body;
  User.findOne({ email: userEmail }, (err, user) => {
    if (!user) {
      errors.email = 'Oops! Email is incorrect.';
      res.render('user/registration', { title: 'Log In', errors });

    } else {
      bcrypt.compare(userPassword, user.password).then((same) => {
        if (same) {
          req.session.userId = user._id;
          res.redirect('/');
        } else {
          errors.password = 'Oops! Password is incorrect.';
          res.render('user/registration', { title: 'Log In', errors });
        }

      });
    }
  })


}



// Check s

exports.checkUser = (req, res, next) => {
  if (req.session.user && req.cookies.user_side) {
    if (req.session.user.emailConf) {
      req.flash('toast', 'You are Registered');
      res.redirect('/');
    } else {
      req.flash('toast', 'Please verify your email to proceed')
      res.redirect('/auth/signup/verify');
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





