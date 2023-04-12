// WebSocket
const sendSocketMessage = (data) => socket.send(data)
const closeSocket = (code) => socket.close(code, "Bye!")

async function get(url) {
  try {
    return await axios.get(url)
  } catch (err) {
    flashMessage(err, 'errors')
  }
}
async function deleteFun(url, data) {
  try {
    return await axios.delete(url, { data })
  } catch (err) {
    flashMessage(err, 'errors')
  }
}

async function post(url, data) {
  try {
    return await axios.post(url, data)
  } catch (err) {
    flashMessage(err, 'errors')
  }
}

async function patch(url, data) {
  try {
    return await axios.patch(url, data)
  } catch (err) {
    flashMessage(err, 'errors')
  }
}
async function put(url, data) {
  try {
    return await axios.put(url, data)
  } catch (err) {
    flashMessage(err, 'errors')
  }
}

function flashMessage(mess, flashType) {
  const message = (mess.response ? mess.response.data : mess);
  [...document.querySelectorAll('.text-flash')].map((flash) => flash.offsetParent.classList.contains(`flash-${flashType}`) ? flash.innerText = message : flash.innerText = '')
  showFlashMessage()
}

function loadingForm(button) {
  button.classList.add('clicked')
  let loading = document.createElement('div')
  loading.className = 'loading show'
  button.prepend(loading)
}

function removeLoadingForm(button) {
  button.firstElementChild.remove()
  button.classList.remove('clicked')
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
  return false
}

async function postData(button, data, url) {
  loadingForm(button)
  const res = await post(url, data)
  removeLoadingForm(button)
  if (!res) return 0
  const path = res.data.redirect
  if (!path) return flashMessage('Please, try again later')
  window.location.href = path
}

function productsToCart(product, count) {
  cartIcon.dataset.content++
  containerDivCart.innerHTML += createDivCarte(product, count)
  checkCart()
}



function changeEmailText(email) {
  document.querySelector('.text-email span').innerHTML = email;
  flashMessage('Email Updated & Resend', 'success')

}

async function headerRemoverX(productEle) {
  loadingForm(productEle)
  productEle.lastElementChild.remove()
  await deleteFun(`/shop/${productEle.id}`, { id: productEle.id, name: 'cart' })
  removeLoadingForm(productEle)
  productEle.remove();
  --cartIcon.dataset.content;
  checkCart();
}

function changeSunTotal(id, count, price) {
  if (isNaN(count) || count <= 0 || count > 9) return 0
  document.querySelector(`#box-${id} .sub-total`).innerHTML = `$${price * count}`
}





