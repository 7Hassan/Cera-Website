const User = require('../models/users')
const Cart = require('../models/cart')
const jwt = require('jsonwebtoken')
const { promisify } = require('util')
const axios = require('axios')
const crypto = require('crypto')
const sendEmail = require('./email')
const catchError = require('../Errors/catch')
const AppError = require('../Errors/classError')
const validator = require('validator');
const { countries, zones } = require("moment-timezone/data/meta/latest.json");


const cookieOptions = {
  expires: new Date(Date.now() + process.env.JWT_COOKIE_EXP * 24 * 60 * 60 * 1000), //? expire in 30 days
  //? secure: true, for only https
  httpOnly: true
}

exports.signPage = (req, res) => res.render('user/createAccount', { title: 'Sign Up' })
exports.logPage = (req, res) => {
  let errors = { email: '', password: '' };
  res.render('user/registration', { title: 'Log In', errors });
};


exports.verifyPage = catchError(async (req, res) => {

  const user = await User.findOne({ _id })

  res.render('user/verification', {
    title: 'Verify your email',
    email: user[0].email,
    errors: req.flash('errors'),
    warning: req.flash('warning'),
    success: req.flash('success'),
    toast: req.flash('toast'),
  });



})








//! sign up
//         req.session.user = {
//           userId: user._id,
//           emailConf: false,
//           photo: '',
//           carteData: [],
//           emailActivationCode: token,



exports.changEmailVerify = (req, res) => {
  // const newEmail = req.body.newEamil;
  // User.findOne({ _id: req.session.user.userId }, (err, userExist) => {
  //   if (err) return console.log(err);
  //   if (!req.session.user.emailConf) {
  //     if (validator.isEmail(newEmail)) {
  //       User.findOne({ email: newEmail }, (error, user) => {
  //         if (!user || error) {
  //           User.updateOne({ _id: req.session.user.userId }, { email: newEmail }, (er) => {
  //             if (er) return console.log(er)
  //             req.flash('success', 'Email updated')
  //             sendEmail(newEmail, req.session.user.emailActivationCode, userExist.firstName);
  //             res.redirect('/auth/signup/verify')
  //           })
  //         } else {
  //           req.flash('errors', 'This email is already in use !')
  //           res.redirect('/auth/signup/verify');
  //         }
  //       })
  //     } else {
  //       req.flash('errors', 'Please enter a valid email !')
  //       res.redirect('/auth/signup/verify');
  //     }
  //   } else {
  //     req.flash('toast', 'You are Registered')
  //     res.redirect('/')
  //   }
  // })
  if (req.body.redirect) {
    res.send('log in')
    console.log('🚀 ~ file: auth.js:111 ~ ', req.body)
  } else {
    res.send('new Email')
  }

}


exports.confirmationEmail = (req, res, next) => {
  // if (req.session.user.emailActivationCode == req.params.token) {
  //   req.session.user.emailConf = true;
  //   req.flash('success', 'Registration Successes');
  //   res.redirect('/');
  //   next();
  // }
  let url = req.protocol + '://' + req.get('host') + '/auth/signup/verify'
  res.send(url)
  redirectFun(url)
}

function redirectFun(url) {
  axios.post(url, { 'redirect': true })
    .then(res => res)
    .catch(err => console.log(err))
}








// exports.checkUser = catchError(async (req, res, next) => {
// if (req.session.user && req.cookies.user_side) {
//   if (req.session.user.emailConf) {
//     req.flash('toast', 'You are Registered');
//     res.redirect('/');
//   } else {
//     req.flash('toast', 'Please verify your email to proceed')
//     res.redirect('/auth/signup/verify');
//   }
// } else {
//   next();
// }

//   let token
//   //? 1) if a token
//   if (req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
//     token = req.headers.authorization.split(' ')[1]

//   //? 2) verification token


//   //? 3) if expire token

//   next()

// })


exports.checkEmail = catchError(async (req, res, next) => {
  const email = req.body.email
  const user = await User.findOne({ email })
  if (user) res.status(200).send(false)
  else res.status(201).send(true)
})




























exports.checkAuth = catchError(async (req, res, next) => {
  //? check if token
  let token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
    token = req.headers.authorization.split(' ')[1]
  //? if valid token
  if (token)
    await promisify(jwt.verify)(token, process.env.JWT_SECRET)
      .then(async (decoded) => {
        //? check if user exist & Password change
        const user = await User.findOne({ _id: decoded.id })
        if (user && !user.isChangedPass(decoded.iat))
          return next(new AppError('You are registered.', 400))
      }).catch(() => 0)

  next()
})


exports.signUp = catchError(async (req, res, next) => {
  //? create a user
  const user = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    country: req.body.country
  })
  res.json({ redirect: '/auth/signup/verify' });
  //? create empty cart 
  await user.createCart(Cart)
  await user.save()

  //? sending an Email
  const token = await user.createToken('email')
  const url = `${req.protocol}://${req.get('host')}${req.originalUrl}/verify/${token}`
  const options = {
    url: url,
    email: user.email,
    name: user.firstName,
    subject: 'Verify your email address',
    about: 'email'
  }
  try {
    sendEmail(options)
  } catch (err) {
    next(new AppError('Error in sending an Email. Try again later', 500))
  }
})


exports.logIn = catchError(async (req, res, next) => {
  // let errors = { email: '', password: '' };
  // const { userEmail, userPassword } = req.body;
  // User.findOne({ email: userEmail }, (err, user) => {
  //   if (!user) {
  //     errors.email = 'Oops! Email is incorrect.';
  //     res.render('user/registration', { title: 'Log In', errors });

  //   } else {
  //     bcrypt.compare(userPassword, user.password).then((same) => {
  //       if (same) {
  //         req.session.userId = user._id;
  //         res.redirect('/');
  //       } else {
  //         errors.password = 'Oops! Password is incorrect.';
  //         res.render('user/registration', { title: 'Log In', errors });
  //       }

  //     });
  //   }
  // })
  //? 1) if email & password are send
  const { email, password } = req.body
  if (!email || !password) return next(new AppError('required email and password.', 400))

  //? 2) if user is exist & correct password
  const user = await User.findOne({ email }).select('+password')
  if (!user) return next(new AppError('Email is incorrect.', 401))
  if (!(await user.isCorrectPass(password, user.password))) return next(new AppError('Password is incorrect.', 401))

  //? 3) create a token send a success response
  const jwtToken = await createJwtToken(user._id)
  res.cookie('jwt', jwtToken, cookieOptions).status(200).send('jwtToken sent')
})

exports.forgetPage = catchError(async (req, res, next) => {
  res.render('user/forget', {
    title: 'Forget password',
    errors: req.flash('errors'),
    warning: req.flash('warning'),
    success: req.flash('success'),
    toast: req.flash('toast'),
  });
})

exports.forgetPass = catchError(async (req, res, next) => {
  //? 1) check user by email
  const user = await User.findOne({ email: req.body.email })
  if (!user) return next(new AppError('Email is incorrect.', 401))

  //? 2) generate a random token
  const token = user.createToken('password')

  //? 3) send a email
  const url = `${req.protocol}://${req.get('host')}${req.originalUrl}/${token}`
  const options = {
    url: url,
    email: user.email,
    name: user.firstName,
    subject: 'Reset your password',
    about: 'password'
  }
  try {
    await sendEmail(options)
    await user.save()
    res.status(201).send('Email sent')
  } catch (err) {
    next(new AppError('Error in sending an Email!, Try again later.', 500))
  }
})

exports.resetPass = catchError(async (req, res, next) => {
  const token = crypto.createHash('sha256').update(req.params.token).digest('hex')
  const newPassword = req.body.newPassword

  //? 1) Get a user based on token & expired date
  const user = await User.findOne({ passwordToken: token, expPasswordToken: { $gt: Date.now() } }).select('+password')
  if (!user) return next(new AppError('Page is not found or Email Date is expired', 404))

  //? 2) Save a new password
  user.password = newPassword
  user.passwordToken = undefined
  user.expPasswordToken = undefined
  await user.save()

  //? 4) log in user & send a token
  const jwtToken = await createJwtToken(user._id)
  res.cookie('jwt', cookieOptions, jwtToken,).status(200).send('jwtToken sent')
})

exports.getCountry = catchError(async (req, res, next) => {
  const cityToCountry = {};
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  Object.keys(zones).forEach(z => {
    const cityArr = z.split("/");
    const city = cityArr[cityArr.length - 1];
    cityToCountry[city] = countries[zones[z].countries[0]].name;
  })
  const city = timeZone.split("/")[1];
  const country = cityToCountry[city];
  res.status(200).send(country)
})












//? create a jwt token
function createJwtToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRED })
}




