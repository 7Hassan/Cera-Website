db = require("../config/dataBase")
const Event = require("../models/users");

let user = new Event({
  firstName: 'Hassan',
  lastName: 'Hossam',
  email: 'egoker1234@gmail.com',
  password: 'tfffrsss5',
  country: 'Egypt',
});

user.save((err) => {
  if (err) {
    console.log("not save user:" + err)
  } else {
    console.log("user saved")
  }
});


