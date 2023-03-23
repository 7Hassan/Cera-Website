
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.message = err.message || 'Error'

  if (err.name == 'ValidationError' || err.name == 'MongoServerError') return validationMongoErr(err, req, res)
  if (err.statusCode === 404) return res.render('pages/404', { title: '404' })
  
  // req.flash('errors', err.message)
  res.status(err.statusCode).send(err.message)
}
module.exports = errorHandler



//! mongo errors
function validationMongoErr(err, req, res) {
  if (err.name == 'MongoServerError') {
    req.flash('errors', 'Email is used')
    return res.status(400).json({ redirect: '/auth/login' })
  }
  req.flash('errors', err.errors[Object.keys(err.errors)[0]].message)
  res.status(400).json({ redirect: '/auth/login' })
}
