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






flashMessage()

if (navA.length !== 0) {
  addActiveBar()
  // getLocalStroageData();
  // totalPrice(document.querySelectorAll(".total"));
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





// set all produces in shop page
// function setAllProducts(products) {
//   let holder = document.querySelector(".holder-cont");
//   let counter = 0;
//   let countContainers = parseInt(products.length / 8);

//   for (let i = 0; i < countContainers; i++) {
//     holder.innerHTML += createSecProducts();
//     setProductBox(holder.children[i].children[1], products, counter, counter + 8);
//     counter += 8;
//   }
//   if (products.length % 8 != 0) {
//     if (products.length % 8 > 4) {
//       holder.innerHTML += createSecProducts();
//       setProductBox(holder.children[countContainers].children[1], products, counter, counter + products.length % 8);

//     } else {
//       holder.innerHTML += createEndSecProducts();
//       setProductBox(holder.children[countContainers].children[1], products, counter, counter + products.length % 8);

//     }
//   }

// }

// Function to set products boxes
// async function setProductBox(element, products, min, max) {
//   for (let i = min; i < max; i++) {
//     element.innerHTML += createProdutBox(products, i);
//   }
// }









// push data in carteData and local stroage
function addProductToCart(id, img, price) {
  document.getElementById('cart-shop').addEventListener('click', () => {

    let check = carteData.filter((prod) => prod.imgUrl == img.src);
    if (check == 0) {
      carteData.push({
        id: id,
        imgUrl: img.src,
        price: price.textContent,
        count: document.getElementById('count-product').value,
      });
      setLocalStroageData();
      cartIcon.dataset.content = carteData.length;
      let positionDive = setDivCarte(
        img.src,
        price.textContent,
        carteData[carteData.length - 1].count
      );
      totalPrice(document.querySelectorAll('.total'));

      movingImg(positionDive)
    }
  });



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


// Create box for product
// function createProdutBox(products, i) {
//   let stars = "";
//   for (let j = 0; j < products[i].stars; j++) {
//     stars += '<i class="fa-solid fa-star"></i>';
//   }
//   if (products[i].stoked == true) {
//     return `
//     <div class="product-box" onclick='window.location.pathname= "/shop/${products[i]._id}"'>
//     <img src="${products[i].imgUrl}" alt="product image">
//       <div class="details"><span>Cera</span>
//         <h5>Cartoon Astronaut ${products[i].name}</h5>
//         <div class="stars">
//         ${stars}
//         </div>
//         <h4>$${products[i].price}</h4>
//       </div>
//       <div><i class="fa-solid fa-cart-shopping cart"></i></div>
//     </div>
// `
//   } else {
//     return `
//     <div class="product-box" style="opacity:.5; pointer-events: none;" >
//     <img src="${products[i].imgUrl}" alt="product image">
//       <div style="color:red; font-weight:600;">It will be soon</div>
//       <div class="details"><span>Cera</span>
//         <h5>Cartoon Astronaut ${products[i].name}</h5>
//         <div class="stars">
//         ${stars}
//         </div>
//         <h4>$${products[i].price}</h4>
//       </div>
//       <div><i class="fa-solid fa-cart-shopping cart"></i></div>
//     </div>
// `
//   }

// }






function createDivCarte(img, price, countInput) {
  return `
    <div>
      <img src="${img}">
      <h2>${price}</h2>
      <h6>x ${countInput}</h6>
      <div class="plus-minus">
        <i class="fa-sharp fa-solid fa-plus"></i>
        <i class="fa-sharp fa-solid fa-minus"></i>
      </div>
      <i class="fa-regular fa-circle-xmark"></i>
    </div>
  `;
}

// Function to set divs products in carte
function setDivCarte(img, price, count) {
  checkOnCarte();
  containerDivCart.firstElementChild.textContent = '';
  let productIput = +count;

  containerDivCart.innerHTML += createDivCarte(img, price, productIput)

  for (let i = 1; i < containerDivCart.children.length; i++) {
    removeProductCarte(containerDivCart.children[i]);
    plusMinus(containerDivCart.children[i], productIput);
  }
  return containerDivCart.lastElementChild.getBoundingClientRect()

}

function checkOnCarte() {
  if (cartIcon.dataset.content == '0') {
    containerDivCart.firstElementChild.textContent = 'add products to cart';
    document.getElementById('buy-button').classList.remove('show');
  } else {
    containerDivCart.firstElementChild.textContent = '';
    document.getElementById('buy-button').classList.add('show');
  }
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
function removeProductCarte(product) {
  product.children[4].addEventListener('click', () => {
    let index = locationInCarteData(product.children[0]);
    product.remove();
    --cartIcon.dataset.content;
    // delete from array of carte shop
    carteData.splice(index, 1);
    //update local storage
    setLocalStroageData();
    //check on carte div
    checkOnCarte();
    totalPrice(document.querySelectorAll('.total'));
  });
}

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
function passwordFunction() {
  let passInput = document.querySelector('.password-input');
  let seeEye = document.querySelector('.fa-eye');
  let hideEye = document.querySelector('.fa-eye-slash');

  //Hide password
  seeEye.addEventListener('click', () => {
    passInput.type = 'password';
    seeEye.style.display = 'none';
    hideEye.style.display = 'inline';
  });
  //see password
  hideEye.addEventListener('click', () => {
    passInput.type = 'text';
    seeEye.style.display = 'inline';
    hideEye.style.display = 'none';
  });
}

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




// function movingImg(positionDive) {
//   let moveImg = document.getElementById('img-master')
//   let positionParent = document.querySelector('.product .other-imgs').getBoundingClientRect()

//   moveImg.classList.add('move')
//   setTimeout(() => {
//     productsCart.classList.add('show')
//     moveImg.style.top = `${positionDive.top - positionParent.top}px`
//     moveImg.style.left = `${positionDive.left - positionParent.left}px`
//     moveImg.style.height = `${positionDive.height - 4}px`
//     moveImg.style.width = '70px'
//   }, 900)
// }



function flashMessage() {
  let flashContents = [...document.querySelectorAll('.text-flash')]
  flashContents.forEach((flashContent) => {
    if (flashContent.innerText != "") {
      flashContent.offsetParent.classList.remove('hidden')
      setTimeout(() => {
        if (flashContent.offsetParent.classList.contains('up-mess')) flashContent.offsetParent.classList.add('hidden')
      }, 4000);
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






