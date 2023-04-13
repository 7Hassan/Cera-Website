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

// add and remove active class to navbar elements
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

/* Payment */
// Function to on create popup overlay
function popupOverlay(elements) {
  let divOverlay = document.querySelector('.over-layout');
  elements.forEach((ele) =>
    ele.addEventListener('click', () => {
      divOverlay.classList.add('show');
      if (ele == elements[0]) document.querySelector('.credit-card').classList.remove('show');
      else document.querySelector('.location').classList.remove('show');
    }));
  divOverlay.addEventListener('click', () => {
    divOverlay.classList.remove('show');
    document.querySelector('.credit-card').classList.add('show');
    document.querySelector('.location').classList.add('show');
  })
}

function cardedSpace() {
  if (onlyNumbers(event)) {
    let cardeInput = document.getElementById('carde-number').value;
    if (cardeInput.length == 4 || cardeInput.length == 9 || cardeInput.length == 14) {
      document.getElementById('carde-number').value = cardeInput + ' ';
      document.getElementById('carde-number').max = 1;
    }
  } else {
    return false
  }
}
function addSlashes() {
  if (onlyNumbers(event)) {
    let cardeInput = document.getElementById('carde-date').value;
    if (cardeInput.length == 2) {
      document.getElementById('carde-date').value = cardeInput + '/';
      document.getElementById('carde-date').max = 1;
    }
  } else {
    return false
  }
}

// function to take numbers only
function onlyNumbers(e) {
  var x = e.which || e.keycode;
  if (x >= 48 && x <= 57) {
    return true;
  } else {
    return false;
  }
}

function cardeSpace() {
  if (onlyNumbers(event)) {
    let cardeInput = document.getElementById('carde-number').value;
    if (
      cardeInput.length == 4 ||
      cardeInput.length == 9 ||
      cardeInput.length == 14
    ) {
      document.getElementById('carde-number').value = cardeInput + ' ';
      document.getElementById('carde-number').max = 1;
    }
  } else {
    return false;
  }
}


function checkCaredFirstNumbers(element, img) {
  if (element.value[0] == 4)
    img.src = 'https://checkoutshopper-live.adyen.com/checkoutshopper/images/logos/visa.svg';
  else if (+element.value[0] + +element.value[1] <= 10)
    img.src = 'https://checkoutshopper-live.adyen.com/checkoutshopper/images/logos/mc.svg';
  else img.src = 'https://checkoutshopper-live.adyen.com/checkoutshopper/images/logos/nocard.svg';
}


function checkCaredAllNumbers(ele) {
  num = ele.value.split(' ').join('');
  if (num.length < 16) {
    document.getElementById('error-carde').classList.add('show');
  } else {
    if (luhnAlgorithmCheck(num)) {
      document.getElementById('error-carde').classList.remove('show');
      document.querySelector('.credit-card button').classList.remove('non-click');
      document.querySelector('.credit-card button').setAttribute('onclick', 'true');
    } else {
      document.getElementById('error-carde').classList.add('show');
    }
  }
}

function luhnAlgorithmCheck(num) {
  let sumEven = 0;

  let sumOdd = 0;

  for (let i = 0; i < num.length; i++) {
    if (i % 2 == 0) {
      if (+num[i] * 2 >= 10) {
        sumEven += (+num[i] * 2 - 9);
      } else {
        sumEven += (+num[i] * 2)
      }
    } else {
      sumOdd += +num[i];
    }
  }
  if ((sumEven + sumOdd) % 10 == 0) return true
  else return false;
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

