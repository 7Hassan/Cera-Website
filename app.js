const express = require('express');
const path = require('path')
const morgan = require('morgan')
// const expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const session = require('express-session');
const SessionStore = require('connect-mongodb-session')(session);
const cookieParser = require('cookie-parser');
const flash = require('connect-flash')

//! security
require('dotenv').config({ path: './.env' }); //? configuration for dotenv
const limitReq = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xssClean = require('xss-clean')
const hpp = require('hpp')


const app = express();

//TODO: Global middle wares
//? set security http header
// app.use(helmet())

//? Read files in 'public' folder
app.set('view engine', 'ejs') //? EJS
app.use(express.static(path.join(__dirname, 'public'))) //? css & js

//? body- parser
app.use(bodyParser.json()); //? reading a data from body to req.body
app.use(bodyParser.urlencoded({ extended: false }))

//? clean Data sent & prevent from attacks
//! Data sanitization against NoSQL query injection => email : {  "$gt": "" }
app.use(mongoSanitize()) //? remove all $ from input

//! Data sanitization against XSS attacks
app.use(xssClean()) //? convert any insert html code in input <div>County </div>  =>   &lt;div>County &lt;/div

//! prevent parameter pollution
app.use(hpp())

//? Cookies
app.use(cookieParser()); //? to access a cookie requests

//? Store Session in data base
const sessionLink = process.env.DATA_BASE_URL.replace('<DATABASENAME>', process.env.DATA_BASE_NAME).replace('<PASSWORD>', process.env.DATA_BASE_PASSWORD)
const STORE = new SessionStore({
  uri: sessionLink,
  collection: 'sessions'
})

//? set Session
app.use(session({
  key: 'client.side',
  secret: 'hassan-hossam',
  saveUninitialized: true,
  resave: true,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 100 }, //! 30 Days
  store: STORE,
}));


//? flash express
app.use(flash());

//? setup express message
app.use((req, res, next) => {
  res.locals.messages = require('express-messages')(req, res);
  next();
});


//? limit many requests to prevent hucks
const limiter = limitReq({
  max: 200, //? maximum requests
  windowMs: 60 * 60 * 1000, //? in 1 Hour
  messages: 'Too many requests. Please try later'
})
app.use('/auth', limiter) //! to prevent many requests attacks on this url

//? for information about requests
app.use(morgan('tiny'));

//? use routing
app.use('/', require('./routes/pages'));
app.use('/api', require('./routes/api'));
app.use('/auth', require('./routes/auth'));

//! 404
const AppError = require('./Errors/classError')
const errorHandler = require('./Errors/errorHandling')

app.all('*', (req, res, next) => next(new AppError('We can\'t find this page', 404)))
app.use(errorHandler)



module.exports = app



