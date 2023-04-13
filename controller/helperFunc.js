const User = require('../models/users')
const jwt = require('jsonwebtoken')
const { promisify } = require('util')
const AppError = require('../Errors/classError')
const { countries, zones } = require("moment-timezone/data/meta/latest.json");
const WebSocket = require('ws');
const multer = require('multer')
const sharp = require('sharp')
const geoip = require('geoip-lite');
const requestIp = require('request-ip');
const iso = require('iso-3166-1-alpha-2')


exports.cookieOptions = {
  expires: new Date(Date.now() + process.env.JWT_COOKIE_EXP * 24 * 60 * 60 * 1000), //? expire in 30 days
  //? secure: true, for only https
  httpOnly: true
}

//? create a jwt token
exports.createJwtToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRED })

exports.getCountry = (req) => {
  const ip = requestIp.getClientIp(req);
  const countryCode = geoip.lookup(ip) ? geoip.lookup(ip).country : ''
  const country = iso.getCountry(countryCode);
  return country
}

exports.testJwtToken = async (req, res, next) => {
  let cookie, user, time
  if (req.cookies) cookie = req.cookies.jwt
  if (!cookie) return { user, time }
  if (cookie.split('.').length !== 3) return { user, time }
  await promisify(jwt.verify)(cookie, process.env.JWT_SECRET)
    .then(async (decoded) => {
      time = decoded.iat
      user = await User.findOne({ _id: decoded.id })
    }).catch((err) => 0)
  return { user, time }
}

exports.sendSocket = (data) => wss.clients.forEach((client) => (client.readyState === WebSocket.OPEN) ? client.send(data) : 0)

exports.pageObject = (title, req) => {
  return {
    title: title,
    errors: req.flash('errors'),
    warning: req.flash('warning'),
    success: req.flash('success'),
    toast: req.flash('toast'),
  }
}

const multerStorage = multer.memoryStorage()
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) cb(null, true)
  else cb(new AppError('Please upload only images', 400), false)
}

exports.upload = multer({ storage: multerStorage, fileFilter: multerFilter })

exports.sharpImg = (req) => sharp(req.file.buffer)
  .resize(500, 500) // size
  .toFormat('jpeg') // to .jpeg
  .jpeg({ quality: 90 }) //quality 90%
  .toFile(`public/imgs/users/${req.file.filename}`)

//! To slice data to show it in a shop page
exports.sliceDataShop = (data, length) => {
  let products = []
  for (let i = 0; i < data.length; i += length) products.push(data.slice(i, length + i))
  return products
}

