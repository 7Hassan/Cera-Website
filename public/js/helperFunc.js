async function post(url, data) {
  try {
    return await axios.post(url, data)
  } catch (err) {
    errorHandling(err)
  }
}

async function get(url) {
  try {
    return await axios.get(url)
  } catch (err) {
    errorHandling(err)
  }
}

function errorHandling(error) {
  if (error.message) return window.alert(error.message)
  window.alert(error)
}



function validationEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

async function checkEmail(email) {
  const error = document.querySelector('.checkerEmail .errors')
  const loadingEle = document.querySelector('.checkerEmail .loading')
  if (!validationEmail(email)) return error.innerHTML = 'Enter a valid Email'
  error.innerHTML = ''
  loadingEle.classList.add('show')
  const res = await post('/auth/signup/check', { email })
  loadingEle.classList.remove('show')
  if (!res.data) error.innerHTML = 'This email is already in use. Want to <a href="/auth/login">Log In</a>?.'
  else error.innerHTML = ''
  checker = res.data
}

function customizeInput(ele) {
  if (!ele) return false
  let error = ele.parentElement.firstElementChild
  if ((ele.value == "") || (ele.type == 'checkbox' && !ele.checked)) return error.innerHTML = "required"
  if (ele.name == 'password' && ele.value.length < 8) return error.innerHTML = "less than 8 characters"
  if (ele.value.length < 3) return error.innerHTML = "too short"
  if (ele.value.length > 15) return error.innerHTML = "too long"
  error.innerHTML = ""
  return true
}

function loadingForm(button) {
  button.classList.add('clicked')
  let loading = document.createElement('div')
  loading.className = 'loading show'
  button.prepend(loading)
}

function removeLoadingForm(button) {
  button.classList.remove('clicked')
  button.firstElementChild.remove()
}

async function signUpAction(button) {
  const data = {
    firstName: firstName.value,
    lastName: lastName.value,
    email: email.value,
    password: password.value,
    country: country.value
  }
  loadingForm(button)
  const res = await post('/auth/signup', data)
  removeLoadingForm(button)
  const path = res.data.redirect
  if (path) return window.location.href = path
  errorHandling('Error in creating data, Please try again')
}

async function logInAction(button) {
  const data = { email: email.value, password: password.value }
  loadingForm(button)
  const res = await post('/auth/login', data)
  removeLoadingForm(button)
  const path = res.data.redirect
  if (path) return window.location.href = path
  const emailErr = document.getElementById('email').parentElement.firstElementChild
  const passwordErr = document.getElementById('password').parentElement.firstElementChild
  const message = res.data
  if (message.includes('Email')) return emailErr.innerHTML = message
  if (message.includes('Password')) return passwordErr.innerHTML = message
  errorHandling('try again later')
}

function checkLogIn(ele) {
  if (!ele) return false
  let error = ele.parentElement.firstElementChild
  if (ele.value == '') return error.innerHTML = "required"
  if (ele.id == 'email' && !validationEmail(ele.value)) return error.innerHTML = "Enter a valid email"
  if (ele.id == 'password' && ele.value.length < 8) return error.innerHTML = "incorrect password"
  error.innerHTML = ""
  return true
}








