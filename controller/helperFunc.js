const User = require('../models/users')
const Cart = require('../models/cart')
const jwt = require('jsonwebtoken')
const base64url = require('base64url')
const { promisify } = require('util')
const axios = require('axios')
const crypto = require('crypto')
const catchError = require('../Errors/catch')
const AppError = require('../Errors/classError')
const validator = require('validator');
const { countries, zones } = require("moment-timezone/data/meta/latest.json");

exports.cookieOptions = {
  expires: new Date(Date.now() + process.env.JWT_COOKIE_EXP * 24 * 60 * 60 * 1000), //? expire in 30 days
  //? secure: true, for only https
  httpOnly: true
}

//? create a jwt token
exports.createJwtToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRED })


exports.getCountry = () => {
  const cityToCountry = {};
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  Object.keys(zones).forEach(z => {
    const cityArr = z.split("/");
    const city = cityArr[cityArr.length - 1];
    cityToCountry[city] = countries[zones[z].countries[0]].name;
  })
  const city = timeZone.split("/")[1];
  return cityToCountry[city];
}

exports.textJwtToken = async (req, res, next) => {
  let cookie, user, time
  if (req.headers.cookie && req.headers.cookie.includes('jwt')) cookie = req.headers.cookie.split('jwt=')[1]

  if (cookie) {
    if (cookie.split('.').length !== 3) return { user, time }
    await promisify(jwt.verify)(cookie, process.env.JWT_SECRET)
      .then(async (decoded) => {
        time = decoded.iat
        user = await User.findOne({ _id: decoded.id })
      }).catch((err) => next(new AppError('Error in processing Token', 500)))
  }
  return { user, time }
}

