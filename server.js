const express = require("express");
const path = require("path");
const db = require("./config/dataBase");
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator')
const flash = require('connect-flash');
const passport = require('passport');
const passportSetup = require('./config/passport-setup');
const port = 3000;
const app = express();

// Templete engine => ejs
const publicDir = path.join(__dirname, "./public"); //هنا بجيب الباث
app.use(express.static(publicDir)); //public هنا بيقراء الملاف الي موجوده ف
app.set("view engine", "ejs");

// body- parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

// Session
app.use(session({
  secret: 'lorem ipsum',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 6000 * 15 },
}));

// Cookiess
app.use(cookieParser());

// flash express
app.use(flash());

// setup express message
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// setup express validator 
// app.use(expressValidator());



// connect passport
app.use(passport.initialize());
app.use(passport.session());






/* Rendering pages */
app.use("/", require("./routes/pages"));
// single product
app.use("/shop", require("./routes/single_prod"));
// handeling user pages
app.use("/users", require("./routes/users"));

// difine 404 page (not found)
app.use((req, res) => {
  res.status(404).render('404', { title: 404 });
})

/*respose to rqueste from front end */
// app.use("/Data", require("./routes/data"));

/* Run server */
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
