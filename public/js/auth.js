// check email
let checker = false

//TODO: Check email exist
async function checkEmail(email) {
  const error = document.querySelector('.checkerEmail .errors')
  const loadingEle = document.querySelector('.checkerEmail .loading')
  if (!validationEmail(email)) return error.innerHTML = 'Enter a valid Email'
  error.innerHTML = ''
  loadingEle.classList.add('show')
  const res = await patch('/auth/signup/check', { email })
  loadingEle.classList.remove('show')
  if (!res.data) error.innerHTML = 'This email is already in use. Want to <a href="/auth/login">Log In</a>?.'
  else error.innerHTML = ''
  checker = res.data
}

//TODO: sign up
function signUp() {
  const form = document.getElementById('signup-form')
  const button = document.querySelector('#signup-form button')
  form.addEventListener('submit', async (event) => {
    event.preventDefault()

    const errors = []
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const email = document.getElementById('email')
    const password = document.getElementById('password');
    const country = document.getElementById('country');
    const checkBox = document.getElementById('checkboxInput');

    errors.push(customizeInput(firstName))
    errors.push(customizeInput(lastName))
    if (email.value == "") email.parentElement.firstElementChild.innerHTML = "required"
    errors.push(customizeInput(password))
    errors.push(customizeInput(country))
    errors.push(customizeInput(checkBox))
    errors.push(checker)

    if (errors.findIndex(err => err != true) == -1) {
      const data = {
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        password: password.value,
        country: country.value
      }
      postData(button, data, '/auth/signup')
    }
  })
}

//TODO: Log in
function logIn() {
  const form = document.getElementById('signup-form')
  const button = document.querySelector('#signup-form button')
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const errors = []
    const email = document.getElementById('email')
    const password = document.getElementById('password')

    errors.push(checkLogIn(email))
    errors.push(checkLogIn(password))

    if (errors.findIndex(err => err != true) == -1) {
      const data = { email: email.value, password: password.value }
      postData(button, data, '/auth/login')
    }
  })
}



//TODO: Update Email 
function updateEmail() {
  const form = document.querySelector('#updateEmail')
  const button = document.querySelector('#updateEmail button')
  form.addEventListener('submit', async (event) => {
    event.preventDefault()

    const errors = []
    const email = document.getElementById('email')

    if (!email.value) {
      email.parentElement.firstElementChild.innerHTML = 'required'
      errors.push('required')
    }
    errors.push(checker)
    console.log('🚀 ~ errors:', errors)

    if (errors.findIndex(err => err != true) == -1) {
      const data = { email: email.value }
      postData(button, data, '/auth/signup/verify')
    }

  })
}




//TODO: Update user Data
function updateUserData() {
  const form = document.querySelector('.form-user-data')
  const button = document.querySelector('.form-user-data button')
  const emailAddress = document.getElementById('email').value
  form.addEventListener('submit', async (event) => {
    event.preventDefault()

    const errors = []
    const firstName = document.getElementById('firstName')
    const lastName = document.getElementById('lastName')
    const email = document.getElementById('email')
    const userImg = document.getElementById('image-input')

    errors.push(customizeInput(firstName))
    errors.push(customizeInput(lastName))
    if (!email.value) {
      email.parentElement.firstElementChild.innerHTML = "required"
      errors.push('required')
    }
    if (email.value !== emailAddress) {
      await checkEmail(email.value)
      errors.push(checker)
    }
    if (errors.findIndex(err => err != true) == -1) {
      const form = new FormData()
      form.append('firstName', firstName.value)
      form.append('lastName', lastName.value)
      form.append('email', email.value)
      form.append('userImg', userImg.files[0])
      postData(button, form, '/me/updateUser')
    }
  })
}

//TODO: Update Password 
function updatePassword() {
  const form = document.querySelector('.form-user-settings')
  const button = document.querySelector('.form-user-settings button')
  form.addEventListener('submit', async (event) => {
    event.preventDefault()

    const errors = []
    const currentPass = document.getElementById('password-current')
    const newPass = document.getElementById('password')
    const confirmPass = document.getElementById('password-confirm')

    errors.push(checkUpdatePass(currentPass))
    errors.push(checkUpdatePass(newPass))
    errors.push(checkUpdatePass(confirmPass))
    if (newPass.value !== confirmPass.value) {
      confirmPass.parentElement.firstElementChild.innerHTML = 'Confirm password isn\'t match'
      errors.push(false)
    }
    if (errors.findIndex(err => err != true) == -1) {
      const data = { currentPass: currentPass.value, newPass: newPass.value, confirmPass: confirmPass.value }
      postData(button, data, '/me/updatePass')
    }
  })
}