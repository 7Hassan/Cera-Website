const errorHandler = (err, req, res, next) => {


  err.statusCode = err.statusCode || 500
  err.message = err.message || 'error'

  // res.status(err.statusCode).send(err.name)
  if (err.name == 'ValidationError' || err.name == 'MongoServerError') return validationMongo(err, res)
  

}

module.exports = errorHandler


function validationMongo(err, res) {
  if (err.name == 'MongoServerError') return res.status(400).send('Email is used')
  res.status(400).send(err.errors[Object.keys(err.errors)[0]].message)
}