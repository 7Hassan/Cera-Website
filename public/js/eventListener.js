
// webSocket
socket.addEventListener('open', (event) => console.log("✅ connected with webSocket server"))
socket.addEventListener('message', (event) => (event.data == 'emailConfirmed') ? location.reload(true) : 0)
socket.addEventListener('close', (event) => console.log('🚫 Disconnected from WebSocket server'))


function cartIconClicker(ele) {
  let holderDivUser = document.querySelector('.user-div')
  let productsCart = document.querySelector('.holder-cart');

  if (userIcon && userIcon.classList.contains('active')) {
    userIcon.classList.remove('active')
    holderDivUser.classList.remove('show')
  }
  ele.classList.toggle('active')
  productsCart.classList.toggle('show')
}

function userIconClicker(ele) {
  let holderDivUser = document.querySelector('.user-div')
  let productsCart = document.querySelector('.holder-cart');

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

function logOut(ele) { postData(ele, { data: 'logOut' }, '/') }

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
async function addProductToCart(ele, id) {
  const count = document.querySelector(`#box-${id} .count-product`)
  const size = document.querySelector(`#box-${id} #select-input`)
  const error = count.parentElement.firstElementChild

  if (!count.value) return error.innerHTML = "required"
  if (isNaN(count.value)) return error.innerHTML = "Only numbers"
  if (+count.value < 1) return error.innerHTML = "Only (+)numbers"
  if (+count.value > 9) return error.innerHTML = "products less 9"
  if (!size.value) return error.innerHTML = "required"
  error.innerHTML = ""
  const data = { count: +count.value, size: size.value, productId: id }
  ele.textContent = ele.classList.contains('pop') ? '' : 'Loading...'
  loadingForm(ele)
  const res = await post(`/shop/${id}`, data)
  removeLoadingForm(ele)
  ele.textContent = ele.classList.contains('pop') ? 'Add' : 'Add To Cart'
  if (res) productsToCart(res.data, data.count)
}

async function removeProduct(productEle) {
  const cartEle = document.querySelector(`#box-${productEle.id} .remove-product-pop`)
  if (!cartEle) return headerRemoverX(productEle)
  const parentCartEle = cartEle.parentElement
  cartEle.firstElementChild.remove()
  loadingForm(cartEle)
  await headerRemoverX(productEle)
  cartEle.remove()
  parentCartEle.innerHTML += productAddCartDiv();
}



async function resendEmail(url, button) {
  loadingForm(button)
  const res = await patch(url, { send: 'Email' })
  removeLoadingForm(button)
  if (res) flashMessage(res.data, 'success')
}

//Hide password
function hidePassword(ele) {
  document.querySelector('.password-input').type = 'password';
  document.querySelector('.fa-eye-slash').style.display = 'inline';
  ele.style.display = 'none';
}
//see password
function showPassword(ele) {
  document.querySelector('.password-input').type = 'text';
  document.querySelector('.fa-eye').style.display = 'inline';
  ele.style.display = 'none';
}

function resetPassLogIn(email) {
  document.querySelector('.main-log').remove()
  document.querySelector('.layout').innerHTML += forgetPassDiv(email)
  const button = document.querySelector('.email-pass button.send-email')
  button.addEventListener('click', () => sendPassEmail(button, email))
}

async function sendPassEmail(button, email) {
  loadingForm(button)
  const res = await patch('/auth/login', { email })
  if (res) await flashMessage(res.data, 'success')
  removeLoadingForm(button)
}

async function quickAddLove(ele, id) {
  const icon = ele.firstElementChild
  loadingForm(ele)
  icon.remove()
  const res = await patch(`/shop/${id}`, { productId: id })
  if (!res) return 0
  removeLoadingForm(ele)
  ele.innerHTML = '<i class="fa-solid fa-heart love"></i>'
  ele.setAttribute('onclick', `quickRemoveLove(this, '${id}')`)
}

async function quickRemoveLove(ele, id) {
  const icon = ele.firstElementChild
  loadingForm(ele)
  icon.remove()
  const res = await deleteFun(`/shop/${id}`, { id, name: 'loves' })
  if (!res) return 0
  removeLoadingForm(ele)
  ele.innerHTML = '<i class="fa-regular fa-heart love"></i>'
  ele.setAttribute('onclick', `quickAddLove(this, '${id}')`)
}


async function quickRemoveProduct(id) {
  removeProduct(document.getElementById(id))
}

async function quickAddProduct(ele, id) {
  const cartDiv = document.querySelector(`#box-${id} .add-product-pop`)
  const parentCartDiv = cartDiv.parentElement
  const popProduct = ele.parentElement.parentElement
  if (await addProductToCart(ele, id)) return 0
  cartDiv.remove()
  parentCartDiv.innerHTML += productRemoveCartDiv(id)
  popProduct.classList.remove('show')
}

function showPopProduct(ele) {
  ele.classList.add('hover')
  const topParent = ele.closest('.master-holder-product')
  topParent.lastElementChild.classList.add('show')
}

function hiddenPopProduct(ele) {
  const cartDiv = document.querySelector(`#${ele.id} .add-product-pop.hover`)
  if (!cartDiv) return 0
  cartDiv.classList.remove('hover')
  ele.lastElementChild.classList.remove('show')
}

function changeInput(id, type, price) {
  const input = document.querySelector(`#box-${id} .count-product`)
  const subTotal = document.querySelector(`#box-${id} .sub-total`)
  if (type == 'plus') input.value++
  else input.value--
  if (subTotal) changeSunTotal(id, input.value, price)
}

async function crashRemover(ele, id) {
  const tr = ele.parentElement.parentElement
  const td = ele.parentElement
  ele.remove()
  loadingForm(td)
  const res = await deleteFun(`/shop/${id}`, { id, name: 'cart' })
  if (!res) return 0
  tr.remove();
  document.getElementById(`total-${id}`).remove()
  totalPrice()
}
async function loveRemover(ele, id) {
  const tr = ele.parentElement.parentElement
  const td = ele.parentElement
  ele.remove()
  loadingForm(td)
  const res = await deleteFun(`/shop/${id}`, { id, name: 'loves' })
  if (!res) return 0
  tr.remove();
}

async function updateCart(ele, id, price) {
  const count = document.querySelector(`#box-${id} .count-product`).value
  const size = document.querySelector(`#box-${id} #select-input`).value
  const td = ele.parentElement
  const data = { count, size, productId: id }
  ele.classList.add('hidden')
  loadingForm(td)
  const res = await put(`/shop/${id}`, data)
  removeLoadingForm(td)
  ele.classList.remove('hidden')
  if (!res) return 0
  document.getElementById(`total-${id}`).lastElementChild.innerHTML = `$${count * price}`
  totalPrice()
}

function changeElementContainer(ele, className) {
  const elementNav = document.querySelector(".side-nav--active")
  const showSec = document.querySelector(`.${className}`)
  const hideSec = document.querySelector(".show-sec")
  elementNav.classList.remove("side-nav--active")
  ele.classList.add("side-nav--active")
  hideSec.classList.replace('show-sec', 'hidden-sec')
  showSec.classList.replace('hidden-sec', 'show-sec')
}

function clickListCountries(ele) {
  let countryInput = document.querySelector('.countryInput');
  let liEle = [...document.querySelectorAll('#countries .selected')];
  if (liEle.length > 0) liEle.map((li) => li.classList.remove('selected'))
  ele.classList.add('selected');
  countryInput.value = ele.textContent;
  document.querySelector('.options').classList.toggle('hidden');
}

function cardPop() {
  document.querySelector('.over-layout').classList.add('show')
  document.querySelector('.credit-card.popup').classList.remove('hidden')
}

function locationPop() {
  document.querySelector('.over-layout').classList.add('show')
  document.querySelector('.location.popup').classList.remove('hidden')
}

function hiddenCard_Location(ele) {
  ele.classList.remove('show');
  document.querySelector('.credit-card.popup').classList.add('hidden');
  document.querySelector('.location.popup').classList.add('hidden');
}

function cardedSpace(num, ele) {
  if (isNaN(num)) return false
  if (!(ele.value.length == 4 || ele.value.length == 9 || ele.value.length == 14)) return true
  ele.value = ele.value + ' ';
  ele.max = 1;
}


function checkCardNumbers(num) {
  const err = document.getElementById('error-carde')
  const img = document.getElementById('visa-img')
  numbers = num.split(' ').join('');
  if (numbers.length < 16)
    img.src = 'https://checkoutshopper-live.adyen.com/checkoutshopper/images/logos/nocard.svg'
  else {
    if (luhnAlgorithm(numbers)) {
      err.classList.remove('show');
      if (numbers[0] == 4)
        img.src = 'https://checkoutshopper-live.adyen.com/checkoutshopper/images/logos/visa.svg';
      else if (+numbers[0] + +numbers[1] <= 10)
        img.src = 'https://checkoutshopper-live.adyen.com/checkoutshopper/images/logos/mc.svg';
      else img.src = 'https://checkoutshopper-live.adyen.com/checkoutshopper/images/logos/nocard.svg';
    } else {
      img.src = 'https://checkoutshopper-live.adyen.com/checkoutshopper/images/logos/nocard.svg';
      err.classList.add('show');
    }
  }
}
