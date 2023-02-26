const express = require('express');
// const expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const session = require('express-session');
const SessionStore = require('connect-mongodb-session')(session);
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const app = express();

//? configuration for dotenv
require('dotenv').config({ path: './.env' });

//? Run Data Base connection
require('./config/dataBase')

//? Read files in 'public' folder
app.use(express.static(`${__dirname}/public`));

//? EJS
app.set('view engine', 'ejs');

//? body- parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

//? Cookies
app.use(cookieParser());

//? Store Session in data base
const sessionLink = process.env.DATA_BASE_URL.replace('<DATABASENAME>', process.env.DATA_BASE_NAME).replace('<PASSWORD>', process.env.DATA_BASE_PASSWORD)
const STORE = new SessionStore({
  uri: sessionLink,
  collection: 'sessions'
})

// set Session
app.use(session({
  key: 'user_side',
  secret: 'hassan-hossam',
  saveUninitialized: true,
  resave: true,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 100 }, //! 30 Days
  store: STORE,
}));

// flash express
app.use(flash());

// setup express message
app.use((req, res, next) => {
  res.locals.messages = require('express-messages')(req, res);
  next();
});



app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));
app.use('/api', require('./routes/api'));

// define 404 page (not found)
// app.use((req, res) => {
//   res.status(404).render('404', { title: 404 });
// })


module.exports = app



