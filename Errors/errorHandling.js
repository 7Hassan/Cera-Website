
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.message = err.message || 'Error'

  if (err.name == 'ValidationError' || err.name == 'CastError' || err.name == 'MongoServerError') return validationMongoErr(err, res)
  if (err.statusCode === 404) return res.render('pages/404', { title: '404' })
  res.status(err.statusCode).send(err.message)
}
module.exports = errorHandler


//! mongo errors
function validationMongoErr(err, res) {
  if (err.name == 'MongoServerError') return res.status(401).send('Email is used')
  if (err.name == 'CastError') return res.status(401).send('not found')
  res.status(401).send(err.errors[Object.keys(err.errors)[0]].message)
}
