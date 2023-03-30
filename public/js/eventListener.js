
// webSocket
socket.addEventListener('open', (event) => console.log("✅ connected with webSocket server"))
socket.addEventListener('message', (event) => (event.data == 'emailConfirmed') ? location.reload(true) : 0)
socket.addEventListener('close', (event) => console.log('🚫 Disconnected from WebSocket server'))


function cartIconClicker(ele) {
  if (userIcon && userIcon.classList.contains('active')) {
    userIcon.classList.remove('active')
    holderDivUser.classList.remove('show')
  }
  ele.classList.toggle('active')
  productsCart.classList.toggle('show')
}

function userIconClicker(ele) {
  if (cartIcon && cartIcon.classList.contains('active')) {
    cartIcon.classList.remove('active')
    productsCart.classList.remove('show')
  }
  ele.classList.toggle('active');
  holderDivUser.classList.toggle('show');
}

function showNav() {
  document.querySelector('.over-layout').classList.add('click-nav')
  document.querySelector('.x-icon').classList.add('show')
  document.body.classList.add('hidden')
  nav.classList.add('click')
}

function hideNav() {
  document.querySelector('.over-layout').classList.remove('click-nav')
  document.querySelector('.x-icon').classList.remove('show')
  document.body.classList.remove('hidden')
  nav.classList.remove('click')
}

async function logOut(ele) {
  loadingForm(ele)
  try {
    const res = await axios.post('/auth/logout', { data: 'logOut' })
    const path = res.data.redirect
    if (path) return window.location.href = path
    else window.alert('try again later')
  } catch (err) {
    console.log(err)

  }
  removeLoadingForm(ele)
}

function changeEmailInput(event) {
  [...document.querySelectorAll('.change-email i')].forEach(ele => ele.classList.toggle('hidden-slide'));
  document.querySelector('.update-email').classList.toggle('hidden')
  event.preventDefault()
}

function moreInformation(event) {
  [...document.querySelectorAll('.help-verify i')].forEach(ele => ele.classList.toggle('hidden-slide'));
  document.querySelector('.info-verify ').classList.toggle('hidden')
  event.preventDefault()
}

function showImg(ele) {
  const reader = new FileReader();
  reader.addEventListener('load', () => document.querySelector('.form__user-photo').src = reader.result)
  reader.readAsDataURL(ele.files[0]);
}

// push data in carteData
async function addProductToCart(ele) {
  const count = document.getElementById('count-product')
  const size = document.getElementById('select-input')
  const error = count.parentElement.firstElementChild
  if (!count.value) return error.innerHTML = "required"
  if (+count.value < 1) return error.innerHTML = "Less than one"
  if (+count.value > 9) return error.innerHTML = "More than 9"
  if (!size.value) return error.innerHTML = "required"

  const data = { count: +count.value, size: size.value }
  ele.textContent = 'Loading...'
  loadingForm(ele)
  const res = await post(window.location.pathname, data)
  removeLoadingForm(ele)
  ele.textContent = 'Add To Cart'
  if (res) productsToCart(res.data, data.count)
}

async function removeProduct(product) {
  loadingForm(product)
  product.lastElementChild.remove()
  await deleteFun(window.location.pathname, { id: product.id })
  removeLoadingForm(product)
  product.remove();
  --cartIcon.dataset.content;
  checkCart();
  totalPrice(document.querySelectorAll('.total'));
}

async function resendEmail(url, button) {
  const data = { send: 'Email' }
  loadingForm(button)
  const res = await patch(url, data)
  removeLoadingForm(button)
  console.log('🚀 ~ res:', res)
}