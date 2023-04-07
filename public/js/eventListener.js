
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
  const count = document.querySelector(`#box-${id} #count-product`)
  const size = document.querySelector(`#box-${id} #select-input`)
  const error = count.parentElement.firstElementChild

  if (!count.value) return error.innerHTML = "required"
  if (+count.value < 1) return error.innerHTML = "Less than one"
  if (+count.value > 9) return error.innerHTML = "More than 9"
  if (!size.value) return error.innerHTML = "required"

  const data = { count: +count.value, size: size.value, productId: id }
  ele.textContent = ele.classList.contains('pop') ? '' : 'Loading...'
  loadingForm(ele)
  const res = await post(`/shop/${id}`, data)
  removeLoadingForm(ele)
  ele.textContent = ele.classList.contains('pop') ? 'Add' : 'Add To Cart'
  if (res) productsToCart(res.data, data.count)
}

async function removeProduct(productEle) {
  loadingForm(productEle)
  productEle.lastElementChild.remove()
  await deleteFun(`/shop/${productEle.id}`, { id: productEle.id })
  removeLoadingForm(productEle)
  productEle.remove();
  --cartIcon.dataset.content;
  checkCart();
  totalPrice(document.querySelectorAll('.total'));
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
  removeLoadingForm(button)
  if (res) flashMessage(res.data, 'success')
}

function quickAddLove(icon) {
  icon.classList.contains('fa-solid') ? icon.classList.replace('fa-solid', 'fa-regular') : icon.classList.replace('fa-regular', 'fa-solid')

}

async function quickRemoveProduct(ele, id) {
  console.log('🚀 ~ ele:', ele)
  const parentEle = ele.parentElement
  ele.firstElementChild.remove()
  loadingForm(ele)
  await removeProduct(document.getElementById(id))
  ele.remove()
  parentEle.innerHTML += productAddCartDiv()
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
  if (cartDiv) cartDiv.classList.remove('hover')
  ele.lastElementChild.classList.remove('show')
}
