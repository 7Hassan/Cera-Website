db = require("../config/dataBase")
const User = require("../models/users");

let user = new User({
  firstName: 'Hassan',
  lastName: 'Hossam',
  email: 'egoker1234@gmail.com',
  password: 'tfffrsss5',
  country: 'Egypt',
  carte: [],
  date: Date.now(),
});

user.save((err) => {
  if (err) {
    console.log("not save user:" + err)
  } else {
    console.log("user saved")
  }
});


