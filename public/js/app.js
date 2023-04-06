/* eslint-disable no-unused-vars */
const socket = new WebSocket('ws://localhost:8080')
const countriesList = ['Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Anguilla', 'Antigua &amp; Barbuda', 'Argentina', 'Armenia', 'Aruba', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan', 'Bolivia', 'Bosnia &amp; Herzegovina', 'Botswana', 'Brazil', 'British Virgin Islands', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Cape Verde', 'Cayman Islands', 'Chad', 'Chile', 'China', 'Colombia', 'Congo', 'Cook Islands', 'Costa Rica', 'Cote D Ivoire', 'Croatia', 'Cruise Ship', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Estonia', 'Ethiopia', 'Falkland Islands', 'Faroe Islands', 'Fiji', 'Finland', 'France', 'French Polynesia', 'French West Indies', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Gibraltar', 'Greece', 'Greenland', 'Grenada', 'Guam', 'Guatemala', 'Guernsey', 'Guinea', 'Guinea Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Isle of Man', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jersey', 'Jordan', 'Kazakhstan', 'Kenya', 'Kuwait', 'Kyrgyz Republic', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macau', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Mauritania', 'Mauritius', 'Mexico', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Montserrat', 'Morocco', 'Mozambique', 'Namibia', 'Nepal', 'Netherlands', 'Netherlands Antilles', 'New Caledonia', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Norway', 'Oman', 'Pakistan', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Puerto Rico', 'Qatar', 'Reunion', 'Romania', 'Russia', 'Rwanda', 'Saint Pierre &amp; Miquelon', 'Samoa', 'San Marino', 'Satellite', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'South Africa', 'South Korea', 'Spain', 'Sri Lanka', 'St Kitts &amp; Nevis', 'St Lucia', 'St Vincent', 'St. Lucia', 'Sudan', 'Suriname', 'Swaziland', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor L\'Este', 'Togo', 'Tonga', 'Trinidad &amp; Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Turks &amp; Caicos', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'Uruguay', 'Uzbekistan', 'Venezuela', 'Vietnam', 'Virgin Islands (US)', 'Yemen', 'Zambia', 'Zimbabwe'];
let carteData = []



// Get Elements in header
let navA = [...document.querySelectorAll('.nav ul a')];
let cartIcon = document.querySelector('.shop-icon');
let userIcon = document.querySelector('.user-icon .fa-user');
let nav = document.getElementById('nav-bar');
let productsCart = document.querySelector('.holder-cart');
let holderDivUser = document.querySelector('.user-div')
let containerDivCart = document.querySelector('.container-cart');






showFlashMessage()
checkCart()
if (navA.length !== 0) {
  addActiveBar()
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
}

// add and remove active class to navbar elements
function addActiveBar() {
  navA.forEach((a) => {
    if (window.location.pathname == a.attributes[0].value) a.classList.add('active')
    a.addEventListener('click', () => navA.forEach((a) => a.classList.remove('active')))
  })
}






/*Local storage */
// function to get data carte from local storage
function getLocalStroageData() {
  if (JSON.parse(localStorage.getItem('data')) != null) {
    carteData = JSON.parse(localStorage.getItem('data'));
    setDataonload();
  }
}

// function to put data carte in local storage
function setLocalStroageData() {
  localStorage.setItem('data', JSON.stringify(carteData));
}



















// function to calculate total price
function totalPrice(elements) {
  let total = 0;
  let products = JSON.parse(localStorage.getItem('data'));
  for (let i = 0; i < products.length; i++) {
    let count = 0;
    let price = 0;
    count = +products[i].count;
    price = +products[i].price.split('$')[1];
    total += count * price;
  }
  elements.forEach((ele) => {
    ele.innerHTML = `$${total}`;
  });
}











// Function to set divs products in carte
function setDivCarte(img, price, count) {
  checkOnCarte();
  containerDivCart.firstElementChild.textContent = '';
  let productInput = +count;

  containerDivCart.innerHTML += createDivCarte(img, price, productInput)

  for (let i = 1; i < containerDivCart.children.length; i++) {
    removeProductCarte(containerDivCart.children[i]);
    plusMinus(containerDivCart.children[i], productInput);
  }
  return containerDivCart.lastElementChild.getBoundingClientRect()

}



function plusMinus(product, productCount) {
  product.children[3].children[0].addEventListener('click', () => {
    if (productCount < 10) {
      productCount++;
    }
    product.children[2].textContent = `x ${productCount}`;
    let index = locationInCarteData(product.children[0]);
    carteData[index].count = productCount;
    setLocalStroageData();
    totalPrice(document.querySelectorAll('.total'));
  });
  product.children[3].children[1].addEventListener('click', () => {
    if (productCount > 1) {
      productCount--;
    }
    product.children[2].textContent = `x ${productCount}`;
    let index = locationInCarteData(product.children[0]);
    carteData[index].count = productCount;
    setLocalStroageData();
    totalPrice(document.querySelectorAll('.total'));
  });
}

// function to remove div from carte on click


// function get location of obj and update in local strorage
function locationInCarteData(img) {
  return carteData.indexOf(carteData.filter((obj) => obj.imgUrl == img.src)[0]);
}

// function to swipe in products
function sideScroll(ele, direction, speed, distance, step) {
  scrollAmount = 0;
  var slideTimer = setInterval(() => {
    direction == 'left' ? (ele.scrollLeft -= step) : (ele.scrollLeft += step);
    scrollAmount += step;
    if (scrollAmount >= distance) {
      window.clearInterval(slideTimer);
    }
  }, speed);
}




function setDataonload() {
  cartIcon.dataset.content = carteData.length;
  for (let i = 0; i < carteData.length; i++) {
    setDivCarte(carteData[i].imgUrl, carteData[i].price, carteData[i].count);
  }
}

/* Payment */
// Function to on create popup overlay
function popupOverlay(elements) {
  let divOverlay = document.querySelector('.over-layout');
  elements.forEach((ele) => {
    ele.addEventListener('click', () => {
      divOverlay.classList.add('show');
      if (ele == elements[0]) {
        document.querySelector('.credit-card').classList.remove('show');
      } else {
        document.querySelector('.location').classList.remove('show');
      }
    });
  });
  divOverlay.addEventListener('click', () => {
    divOverlay.classList.remove('show');
    document.querySelector('.credit-card').classList.add('show');
    document.querySelector('.location').classList.add('show');
  });
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
  if (element.value[0] == 4) {
    img.src = 'https://checkoutshopper-live.adyen.com/checkoutshopper/images/logos/visa.svg';
  } else if (+element.value[0] + +element.value[1] <= 10) {
    img.src = 'https://checkoutshopper-live.adyen.com/checkoutshopper/images/logos/mc.svg';

  } else {
    img.src = 'https://checkoutshopper-live.adyen.com/checkoutshopper/images/logos/nocard.svg';
  }
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







//get data from onclicked product
function getDataProduct(product) {
  let nameProducts = [...document.querySelectorAll('.name-product')];
  document.getElementById('main-img').src = product.imgUrl;
  nameProducts.forEach((namePro) => {
    namePro.textContent = product.name;
  });
  document.getElementById('price-product').textContent = `$${product.price}`;
}



// function createSecProducts() {
//   return `
//       <div div class= "button-products" >
//       <button class="left-slide" onclick='sideScroll(this.parentElement.children[1], "left", 4, 800, 10)'>
//         <i class="fa-solid fa-angles-left"></i>
//       </button>
//       <div class="container boxs">
//       </div>
//       <button class="right-slide" onclick='sideScroll(this.parentElement.children[1], "right", 4, 800, 10)'>
//         <i class="fa-solid fa-angles-right"></i>
//       </button>
//     </div >
//         `;
// }

// function createEndSecProducts() {
//   return `
//         <div div class="button-products" >
//   <button style=" visibility: hidden;"  class="left-slide" onclick='sideScroll(this.parentElement.children[1], "left", 4, 800, 10)'>
//     <i class="fa-solid fa-angles-left"></i>
//   </button>
//   <div class="container boxs">
//   </div>
//   <button style=" visibility: hidden;" class="right-slide" onclick='sideScroll(this.parentElement.children[1], "right", 4, 800, 10)'>
//     <i class="fa-solid fa-angles-right"></i>
//   </button>s
// </div >
//         `;
// }
/* see and hide passord function */





function observesTop() {
  let divs = document.querySelectorAll('.product-box');
  const option = {
    root: null,
    rootMargin: '250px 0px 0px',
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(ele => ele.target.classList.toggle('product-show-top', ele.isIntersecting));
  }, option);
  divs.forEach(div => {
    observer.observe(div);
  })
}

function observesLeft() {
  let divEle = document.querySelectorAll('.other-imgs img');
  const option = {};
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(ele => ele.target.classList.toggle('product-show-left', ele.isIntersecting))
  }, option)
  divEle.forEach(div => observer.observe(div))
}

function observesRight() {
  const option = {};
  let divEle = document.querySelectorAll('.product-box');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(ele => ele.target.classList.toggle('product-show-right', ele.isIntersecting))
  }, option);
  divEle.forEach(div => observer.observe(div))
}

function getCountries() {
  let countriesHolder = document.getElementById('countries');
  let searchInput = document.querySelector('.searchInput');
  countriesList.map(country => countriesHolder.innerHTML += `<li  onclick="clickListCountries(this)">${country}</li>`)
  searchInput.addEventListener('input', (event) => {
    countriesHolder.innerHTML = '';
    const countries = countriesList.filter((country) => country.toLowerCase().includes(event.target.value.toLowerCase()))
    if (countries.length == 0) return countriesHolder.innerHTML = '<li style="cursor: context-menu; color:red;">! No results found</li>';
    countries.map((country) => countriesHolder.innerHTML += `<li  onclick="clickListCountries(this)"> ${country}</li>`)
  })
}


function clickListCountries(ele) {
  let countryInput = document.querySelector('.countryInput');
  let eleSelected = document.querySelector('#countries .selected');
  if (eleSelected) eleSelected.classList.remove('selected');
  ele.classList.add('selected');
  countryInput.value = ele.textContent;
  countryInput.style.color = 'black';
  document.querySelector('.options').classList.toggle('hidden');
}




function showFlashMessage() {
  let flashContents = [...document.querySelectorAll('.text-flash')]
  flashContents.forEach((flashContent) => {
    const parentFlash = flashContent.offsetParent
    parentFlash.classList.add('hidden')
    if (flashContent.innerText) {
      parentFlash.classList.remove('hidden')
      if (parentFlash.classList.contains('up-mess')) setTimeout(() => {
        parentFlash.classList.add('hidden')
        setTimeout(() => flashContent.innerText = '', 900)
      }, 4000)
    }
  })
}







function goToElement(id) {
  const element = document.getElementById(`box-${id}`)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    element.classList.add('shadow')
  }
}


