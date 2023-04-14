/* eslint-disable no-unused-vars */
const socket = new WebSocket('ws://localhost:8080')

// Get Elements in header
let userIcon = document.querySelector('.user-icon .fa-user');
let cartIcon = document.querySelector('.shop-icon');
let nav = document.getElementById('nav-bar');

showFlashMessage()
addActiveBar()
checkCart()

function showFlashMessage() {
  let flashContents = [...document.querySelectorAll('.text-flash')]
  if (!flashContents) return 0
  flashContents.forEach((flashContent) => {
    const parentFlash = flashContent.offsetParent
    parentFlash.classList.add('hidden')
    if (!flashContent.innerText) return 0
    parentFlash.classList.remove('hidden')
    if (!parentFlash.classList.contains('up-mess')) return 0
    setTimeout(() => {
      parentFlash.classList.add('hidden')
      setTimeout(() => flashContent.innerText = '', 900)
    }, 4000)
  })
}


function checkCart() {
  const element = document.querySelector('.text-cart')
  if (!element) return 0
  if (cartIcon.dataset.content == '0') {
    element.textContent = 'add products to cart';
    document.getElementById('buy-button').classList.remove('show');
  } else {
    element.textContent = '';
    document.getElementById('buy-button').classList.add('show');
  }
  totalPrice()
}

function addActiveBar() {
  let navA = [...document.querySelectorAll('.nav ul a')]
  if (!navA) return 0
  navA.forEach((a) => {
    if (window.location.pathname == a.attributes[0].value) a.classList.add('active')
    a.addEventListener('click', () => navA.forEach((a) => a.classList.remove('active')))
  })
}

function totalPrice() {
  let total = 0;
  let prices = [...document.querySelectorAll('.container-cart .total-product-price span')]
  let totalEle = document.querySelector('.total-carte .total')
  if (!prices || !totalEle) {
    prices = [...document.querySelectorAll('.holder-total table .sub-total-product')]
    totalEle = document.querySelector('.holder-total table .total-products-price')
  }
  prices.map((priceEle) => total += +priceEle.innerText.split('$')[1])
  totalEle.innerHTML = `$${total}`
}
class Observe {
  constructor() {
    this.products = document.querySelectorAll('.product-box');
    this.option = { root: null, rootMargin: '250px 0px 0px' }
  }
  top() {
    const observer = new IntersectionObserver((entries) => entries.forEach(ele =>
      ele.target.classList.toggle('product-show-top', ele.isIntersecting)), this.option);
    this.products.forEach(div => observer.observe(div))
  }
  left() {
    const observer = new IntersectionObserver((entries) =>
      entries.forEach(ele => ele.target.classList.toggle('product-show-right', ele.isIntersecting)))
    this.products.forEach(div => observer.observe(div))
  }
}
const observe = new Observe

