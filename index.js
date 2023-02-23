
const express = require("express");

require('dotenv').config();

const db = require("./config/dataBase");

const bodyParser = require('body-parser');

const session = require('express-session');

const SessionStore = require('connect-mongodb-session')(session);

const cookieParser = require('cookie-parser');

const expressValidator = require('express-validator');

const flash = require('connect-flash');

const passport = require('passport');
const passportSetup = require('./config/passport-setup');

const app = express();


// Files
const path = require("path");
const publicDir = path.join(__dirname, "./public"); //هنا بجيب الباث

// EJS
app.use(express.static(publicDir)); //public هنا بيقراء الملاف الي موجوده ف
app.set("view engine", "ejs");

// body- parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

// Cookiess
app.use(cookieParser());

// Store Session in data base
const STORE = new SessionStore({
  uri: process.env.SESSIONURL,
  collection: 'sessions'
})

// set Session
app.use(session({
  key: 'user_side',
  secret: 'hassan-hossam',
  saveUninitialized: true,
  resave: true,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 100 }, // 30 Days
  store: STORE,
}));

// flash express
app.use(flash());

// setup express message
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// connect passport
app.use(passport.initialize());
app.use(passport.session());

/* Rendering pages */
app.use("/", require("./routes/pages"));

// single product
app.use("/shop", require("./routes/single_prod"));

// handeling user pages
app.use("/auth", require("./routes/auth"));

// difine 404 page (not found)
app.use((req, res) => {
  res.status(404).render('404', { title: 404 });
})

/* Run server */
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
