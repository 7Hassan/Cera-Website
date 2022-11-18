// Data in carte
let carteData = [];

// Get Elements in header
let navA = [...document.querySelectorAll(".nav ul a")];
let navIcon = document.querySelector(".shop-icon");
let userIcon = document.querySelector(".user-icon i");
let nav = document.getElementById("nav-bar");
let navButtom = document.querySelector("#nav-buttom i");
let xIcon = document.querySelector(".x-icon i");
let holderDivsCart = document.querySelector(".holder-cart");
let holderDivUser = document.querySelector(".user-div");
let containerDivsCart = document.querySelector(".container-cart");

// Run Function
if (window.location.pathname != "/payment.hbs" && window.location.pathname != "/createAccount.hbs" && window.location.pathname != "/registration.hbs") {
  addActiveBar();
  clickHaederMenu();
  getLocalStroageData();
  totalPrice(document.querySelectorAll(".total"));
}


// Function to add active class  to navbar elements
function addActiveBar() {
  //add active class  to navbar a elements
  navA.forEach((a) => {
    a.addEventListener("click", () => {
      removeActiveBar();
      a.classList.add("active");
    });
  });

  //add and remove active class from navbar icon
  navIcon.addEventListener("click", () => {
    if (userIcon.classList.contains("active")) {
      userIcon.classList.remove("active");
      holderDivUser.classList.remove("show");
    }
    navIcon.classList.toggle("active");
    holderDivsCart.classList.toggle("show");
  });
  userIcon.addEventListener("click", () => {
    if (navIcon.classList.contains("active")) {
      navIcon.classList.remove("active");
      holderDivsCart.classList.remove("show");
    }
    userIcon.classList.toggle("active");
    holderDivUser.classList.toggle("show");
  });
}



// Function to add and remove click class from heder menu buttom
function clickHaederMenu() {
  navButtom.addEventListener("click", () => {
    document.querySelector(".over-layout").classList.add('click-nav');
    document.querySelector(".x-icon").classList.add('show');
    document.body.classList.add('hidden')
    nav.classList.add("click");
  });
  xIcon.addEventListener("click", () => {
    document.querySelector(".over-layout").classList.remove('click-nav');
    document.querySelector(".x-icon").classList.remove('show');
    document.body.classList.remove('hidden')
    nav.classList.remove("click");
  });



}

/*Local storage */
// function to get data carte from local storage
function getLocalStroageData() {
  if (JSON.parse(localStorage.getItem("data")) != null) {
    carteData = JSON.parse(localStorage.getItem("data"));
    setDataonload();
  }
}

// function to put data carte in local storage
function setLocalStroageData() {
  localStorage.setItem("data", JSON.stringify(carteData));
}

/* Shop page */
async function showData() {
  //All data
  products = await getAllData();

  setAllproducts(products);

  setProdutBoxs(document.querySelector(".other-products .container"), products, 4, 8);
  //on click on product
  ProductsOnclick(products);

  //Add products to shop carte
  addProductToCart(
    document.getElementById("main-img"),
    document.getElementById("price-product")
  );

  totalPrice(document.querySelectorAll(".total"));
}

// Get Data
async function getAllData() {
  response = await axios.get("http://localhost:3000/Data");
  return response.data.products;
}

// set all producrs in shop page
function setAllproducts(products) {
  let holder = document.querySelector(".holder-cont");
  let counter = 0;
  let countContainers = parseInt(products.length / 8);

  for (let i = 0; i < countContainers; i++) {
    holder.innerHTML += createSecProducts();
    setProdutBoxs(holder.children[i].children[1], products, counter, counter + 8);
    counter += 8;
  }
  if (products.length % 8 != 0) {
    if (products.length % 8 > 4) {
      holder.innerHTML += createSecProducts();
      setProdutBoxs(holder.children[countContainers].children[1], products, counter, counter + products.length % 8);

    } else {
      holder.innerHTML += createEndSecProducts();
      setProdutBoxs(holder.children[countContainers].children[1], products, counter, counter + products.length % 8);

    }
  }

}

// Function to set products boxs
async function setProdutBoxs(element, path, min, max) {
  for (let i = min; i < max; i++) {
    element.innerHTML += createProdutBox(path, i);
  }
}

// get and set product on click
function ProductsOnclick(products) {
  document.querySelectorAll(".product-box").forEach((product) => {
    product.addEventListener("click", () => {
      document.querySelector(".mian-shop").style.display = "none";
      document.querySelector(".product-home").style.display = "block";

      //get data of current product
      let productImgSrc = product.firstElementChild.src.split("3000/")[1];
      let productData = products.filter((obj) => obj.imgUrl == productImgSrc);
      let indexProduct = products.indexOf(productData[0]);

      getDataProduct(productData[0]);
      // show imgs thats are around main img of product
      showOtherImgs(products, indexProduct);
    });
  });
}

// push data in carteData and local stroage
function addProductToCart(img, price) {
  document.getElementById("cart-shop").addEventListener("click", () => {
    let check = carteData.filter((prod) => prod.imgUrl == img.src);
    if (check == 0) {
      carteData.push({
        imgUrl: img.src,
        price: price.textContent,
        count: document.getElementById("count-product").value,
      });
      setLocalStroageData();
      navIcon.dataset.content = carteData.length;
      setDivCarte(
        img.src,
        price.textContent,
        carteData[carteData.length - 1].count
      );
      totalPrice(document.querySelectorAll(".total"));
    }
  });
}

// function to calculate total price
function totalPrice(elements) {
  let total = 0;
  let products = JSON.parse(localStorage.getItem("data"));
  for (let i = 0; i < products.length; i++) {
    let count = 0;
    let price = 0;
    count = +products[i].count;
    price = +products[i].price.split("$")[1];
    total += count * price;
  }
  elements.forEach((ele) => {
    ele.innerHTML = `$${total}`;
  });
}















// Create box for product
function createProdutBox(path, i) {
  let stars = "";
  for (let i = 0; i < path[i].stars; i++) {
    stars += '<i class="fa-solid fa-star"></i>';
  }
  return `
        <div class="product-box"><img src="${path[i].imgUrl}" alt="product image">
          <div class="details"><span>Cera</span>
            <h5>Cartoon Astronaut ${path[i].name}</h5>
            <div class="stars">
            ${stars}
            </div>
            <h4>$${path[i].price}</h4>
          </div>
          <div><i class="fa-solid fa-cart-shopping cart"></i></div>
        </div>
    `;
}


// Function to remove all active classes  form navbar elements
function removeActiveBar() {
  navA.forEach((a) => {
    a.classList.remove("active");
  });
}



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
  containerDivsCart.firstElementChild.textContent = "";
  let productIput = +count;

  containerDivsCart.innerHTML += createDivCarte(img, price, productIput);

  for (let i = 1; i < containerDivsCart.children.length; i++) {
    removeProductCarte(containerDivsCart.children[i]);
    plusMinus(containerDivsCart.children[i], productIput);
  }
}

function checkOnCarte() {
  if (navIcon.dataset.content == "0") {
    containerDivsCart.firstElementChild.textContent = "add products to cart";
    document.getElementById("buy-button").classList.remove("show");
  } else {
    containerDivsCart.firstElementChild.textContent = "";
    document.getElementById("buy-button").classList.add("show");
  }
}

function plusMinus(product, productCount) {
  product.children[3].children[0].addEventListener("click", () => {
    if (productCount < 10) {
      productCount++;
    }
    product.children[2].textContent = `x ${productCount}`;
    let index = locationInCarteData(product.children[0]);
    carteData[index].count = productCount;
    setLocalStroageData();
    totalPrice(document.querySelectorAll(".total"));
  });
  product.children[3].children[1].addEventListener("click", () => {
    if (productCount > 1) {
      productCount--;
    }
    product.children[2].textContent = `x ${productCount}`;
    let index = locationInCarteData(product.children[0]);
    carteData[index].count = productCount;
    setLocalStroageData();
    totalPrice(document.querySelectorAll(".total"));
  });
}

// function to remove div from carte on click
function removeProductCarte(product) {
  product.children[4].addEventListener("click", () => {
    let index = locationInCarteData(product.children[0]);
    product.remove();
    --navIcon.dataset.content;
    // delet from array of carte shop
    carteData.splice(index, 1);
    //update local storage
    setLocalStroageData();
    //check on carte div
    checkOnCarte();
    totalPrice(document.querySelectorAll(".total"));
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
    direction == "left" ? (ele.scrollLeft -= step) : (ele.scrollLeft += step);
    scrollAmount += step;
    if (scrollAmount >= distance) {
      window.clearInterval(slideTimer);
    }
  }, speed);
}




function setDataonload() {
  navIcon.dataset.content = carteData.length;
  for (let i = 0; i < carteData.length; i++) {
    setDivCarte(carteData[i].imgUrl, carteData[i].price, carteData[i].count);
  }
}

/* Payment */
// Function to on create popup overlay
function popupOverlay(elements) {
  let divOverlay = document.querySelector(".over-layout");
  elements.forEach((ele) => {
    ele.addEventListener("click", () => {
      divOverlay.classList.add("show");
      if (ele == elements[0]) {
        document.querySelector(".credit-card").classList.remove("show");
      } else {
        document.querySelector(".location").classList.remove("show");
      }
    });
  });
  divOverlay.addEventListener("click", () => {
    divOverlay.classList.remove("show");
    document.querySelector(".credit-card").classList.add("show");
    document.querySelector(".location").classList.add("show");
  });
}

function cardeSpace() {
  if (onlyNumbers(event)) {
    let cardeInput = document.getElementById("carde-number").value;
    if (cardeInput.length == 4 || cardeInput.length == 9 || cardeInput.length == 14) {
      document.getElementById("carde-number").value = cardeInput + " ";
      document.getElementById("carde-number").max = 1;
    }
  } else {
    return false
  }
}
function addSlashes() {
  if (onlyNumbers(event)) {
    let cardeInput = document.getElementById("carde-date").value;
    if (cardeInput.length == 2) {
      document.getElementById("carde-date").value = cardeInput + "/";
      document.getElementById("carde-date").max = 1;
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
    let cardeInput = document.getElementById("carde-number").value;
    if (
      cardeInput.length == 4 ||
      cardeInput.length == 9 ||
      cardeInput.length == 14
    ) {
      document.getElementById("carde-number").value = cardeInput + " ";
      document.getElementById("carde-number").max = 1;
    }
  } else {
    return false;
  }
}


function checkCardeFirstNumbers(element, img) {
  if (element.value[0] == 4) {
    img.src = "https://checkoutshopper-live.adyen.com/checkoutshopper/images/logos/visa.svg";
  } else if (+element.value[0] + +element.value[1] <= 10) {
    img.src = "https://checkoutshopper-live.adyen.com/checkoutshopper/images/logos/mc.svg";

  } else {
    img.src = "https://checkoutshopper-live.adyen.com/checkoutshopper/images/logos/nocard.svg";
  }
}


function checkCardeAllNumbers(ele) {
  num = ele.value.split(" ").join("");

  if (num.length < 16) {
    document.getElementById("error-carde").classList.add("show");
  } else {
    if (luhnAlgorithmCheck(num)) {
      document.getElementById("error-carde").classList.remove("show");
      document.querySelector('.credit-card button').classList.remove("non-click");
      document.querySelector('.credit-card button').setAttribute('onclick', 'true');
    } else {
      document.getElementById("error-carde").classList.add("show");
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


// onclick on img to show
function showOtherImgs(products, Index) {
  allImgs = [...document.querySelectorAll(".other-imgs img")];
  allImgs[0].src = products[Index].imgUrl;
  for (let i = 0; i < allImgs.length; i++) {
    if (Index + i >= products.length) {
      Index = 0;
    }
    console.log(Index + i);

    allImgs[i].src = products[Index + i].imgUrl;
    allImgs[i].addEventListener("click", () => {
      document.getElementById("main-img").src = allImgs[i].src;
      getDataProduct(products[Index + i]);
    });
  }
}



//get data from onclicked product
function getDataProduct(product) {
  let nameProducts = [...document.querySelectorAll(".name-product")];
  document.getElementById("main-img").src = product.imgUrl;
  nameProducts.forEach((namePro) => {
    namePro.textContent = product.name;
  });
  document.getElementById("price-product").textContent = `$${product.price}`;
}



function createSecProducts() {
  return `
    <div class="button-products">
      <button class="left-slide" onclick='sideScroll(this.parentElement.children[1], "left", 4, 800, 10)'>
        <i class="fa-solid fa-angles-left"></i>
      </button>
      <div class="container boxs">
      </div>
      <button class="right-slide" onclick='sideScroll(this.parentElement.children[1], "right", 4, 800, 10)'>
        <i class="fa-solid fa-angles-right"></i>
      </button>
    </div>
  `;
}

function createEndSecProducts() {
  return `
  <div class="button-products">
  <button style=" visibility: hidden;"  class="left-slide" onclick='sideScroll(this.parentElement.children[1], "left", 4, 800, 10)'>
    <i class="fa-solid fa-angles-left"></i>
  </button>
  <div class="container boxs">
  </div>
  <button style=" visibility: hidden;" class="right-slide" onclick='sideScroll(this.parentElement.children[1], "right", 4, 800, 10)'>
    <i class="fa-solid fa-angles-right"></i>
  </button>
</div>
  `;
}
/* see and hide passord function */
function passordFunction() {
  let passInput = document.querySelector('.password-input');
  let seeEye = document.querySelector('.fa-eye');
  let hideEye = document.querySelector('.fa-eye-slash');

  //Hide password
  seeEye.addEventListener('click', () => {
    passInput.type = "password";
    seeEye.style.display = 'none';
    hideEye.style.display = 'inline';
  });
  //see password
  hideEye.addEventListener('click', () => {
    passInput.type = "text";
    seeEye.style.display = 'inline';
    hideEye.style.display = 'none';
  });
}


