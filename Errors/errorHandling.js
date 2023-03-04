
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.message = err.message || 'error'

  if (err.name == 'ValidationError' || err.name == 'MongoServerError')
    return validationMongoErr(err, res)

  res.status(err.statusCode).send(err.message)


}

module.exports = errorHandler

//! mongo errors
function validationMongoErr(err, res) {
  if (err.name == 'MongoServerError') return res.status(400).send('Email is used')
  res.status(400).send(err.errors[Object.keys(err.errors)[0]].message)
}

//! jwt errors
// function ValidTokenErr(err, res) {

// }