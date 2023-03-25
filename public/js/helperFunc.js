// WebSocket
const sendSocketMessage = (data) => socket.send(data)
const closeSocket = (code) => socket.close(code, "Bye!")

async function get(url) {
  try {
    return await axios.get(url)
  } catch (err) {
    errorHandling(err)
  }
}

async function post(url, data) {
  try {
    return await axios.post(url, data)
  } catch (err) {
    errorHandling(err)
  }
}

async function patch(url, data) {
  try {
    return await axios.patch(url, data)
  } catch (err) {
    errorHandling(err)
  }
}

function errorHandling(err) {
  const messageErr = err.response ? err.response.data : err
  const flash = document.querySelector('.flash-errors .text-flash')
  flash.innerText = messageErr
  flashMessage()
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

function customizeInput(ele) {
  if (!ele) return false
  let error = ele.parentElement.firstElementChild
  if ((!ele.value) || (ele.type == 'checkbox' && !ele.checked)) return error.innerHTML = "required"
  if (ele.name == 'password' && ele.value.length < 8) return error.innerHTML = "less than 8 characters"
  if (ele.value.length < 3) return error.innerHTML = "too short"
  if (ele.value.length > 15) return error.innerHTML = "too long"
  error.innerHTML = ""
  return true
}

function checkUpdatePass(ele) {
  const error = ele.parentElement.firstElementChild
  if (!ele.value) return error.innerHTML = 'required'
  if (ele.value.length < 8) return error.innerHTML = 'less than 8 characters'
  error.innerHTML = ''
  return true
}

function validationEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function checkLogIn(ele) {
  if (!ele) return false
  let error = ele.parentElement.firstElementChild
  if (!ele.value) return error.innerHTML = "required"
  if (ele.id == 'email' && !validationEmail(ele.value)) return error.innerHTML = "Enter a valid email"
  if (ele.id == 'password' && ele.value.length < 8) return error.innerHTML = "incorrect password"
  error.innerHTML = ""
  return true
}

async function postData(button, data, url) {
  loadingForm(button)
  const res = await post(url, data)
  removeLoadingForm(button)
  if (!res) return 0
  const path = res.data.redirect
  if (!path) return errorHandling('Please, try again later')
  window.location.href = path
}









