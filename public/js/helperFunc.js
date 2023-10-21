// WebSocket
const sendSocketMessage = (data) => socket.send(data)
const closeSocket = (code) => socket.close(code, "Bye!")


async function get(url) {
  try { return await axios.get(url) }
  catch (err) { flashMessage(err, 'errors') }
}
async function deleteFun(url, data) {
  try { return await axios.delete(url, { data }) }
  catch (err) { flashMessage(err, 'errors') }
}

async function post(url, data) {
  try { return await axios.post(url, data) }
  catch (err) { flashMessage(err, 'errors') }
}

async function patch(url, data) {
  try { return await axios.patch(url, data) }
  catch (err) { flashMessage(err, 'errors') }
}
async function put(url, data) {
  try { return await axios.put(url, data) }
  catch (err) { flashMessage(err, 'errors') }
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
  let containerDivCart = document.querySelector('.container-cart');
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

function goToElement() {
  const id = window.location.href.split('?')[1]
  if (!id) return 0
  const element = document.getElementById(`box-${id}`)
  if (!element) return 0
  element.scrollIntoView({ behavior: 'smooth', block: 'center' })
  element.firstElementChild.classList.add('shadow')
}

function getCountries() {
  const countriesList = ['Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Anguilla', 'Antigua &amp; Barbuda', 'Argentina', 'Armenia', 'Aruba', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan', 'Bolivia', 'Bosnia &amp; Herzegovina', 'Botswana', 'Brazil', 'British Virgin Islands', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Cape Verde', 'Cayman Islands', 'Chad', 'Chile', 'China', 'Colombia', 'Congo', 'Cook Islands', 'Costa Rica', 'Cote D Ivoire', 'Croatia', 'Cruise Ship', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Estonia', 'Ethiopia', 'Falkland Islands', 'Faroe Islands', 'Fiji', 'Finland', 'France', 'French Polynesia', 'French West Indies', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Gibraltar', 'Greece', 'Greenland', 'Grenada', 'Guam', 'Guatemala', 'Guernsey', 'Guinea', 'Guinea Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Isle of Man', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jersey', 'Jordan', 'Kazakhstan', 'Kenya', 'Kuwait', 'Kyrgyz Republic', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macau', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Mauritania', 'Mauritius', 'Mexico', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Montserrat', 'Morocco', 'Mozambique', 'Namibia', 'Nepal', 'Netherlands', 'Netherlands Antilles', 'New Caledonia', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Norway', 'Oman', 'Pakistan', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Puerto Rico', 'Qatar', 'Reunion', 'Romania', 'Russia', 'Rwanda', 'Saint Pierre &amp; Miquelon', 'Samoa', 'San Marino', 'Satellite', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'South Africa', 'South Korea', 'Spain', 'Sri Lanka', 'St Kitts &amp; Nevis', 'St Lucia', 'St Vincent', 'St. Lucia', 'Sudan', 'Suriname', 'Swaziland', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor L\'Este', 'Togo', 'Tonga', 'Trinidad &amp; Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Turks &amp; Caicos', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'Uruguay', 'Uzbekistan', 'Venezuela', 'Vietnam', 'Virgin Islands (US)', 'Yemen', 'Zambia', 'Zimbabwe']
  let countriesHolder = document.getElementById('countries');
  let searchInput = document.querySelector('.searchInput');
  let countryValue = document.querySelector('.countryInput').value;
  countriesList.map(country => {
    if (country == countryValue) countriesHolder.innerHTML += `<li class="selected  onclick="clickListCountries(this)">${country}</li>`
    else countriesHolder.innerHTML += `<li onclick="clickListCountries(this)">${country}</li>`
  })
  searchInput.addEventListener('input', (event) => {
    countriesHolder.innerHTML = '';
    const countries = countriesList.filter((country) => country.toLowerCase().includes(event.target.value.toLowerCase()))
    if (countries.length == 0) return countriesHolder.innerHTML = '<li style="cursor: context-menu; color:red;">! No results found</li>';
    countries.map((country) => countriesHolder.innerHTML += `<li  onclick="clickListCountries(this)"> ${country}</li>`)
  })
}

function luhnAlgorithm(numbers) {
  let sumEven = 0;
  let sumOdd = 0;
  for (let i = 0; i < numbers.length; i++) {
    if (i % 2 == 0) {
      if (+numbers[i] * 2 >= 10) sumEven += (+numbers[i] * 2 - 9);
      else sumEven += (+numbers[i] * 2)
    } else sumOdd += +numbers[i];
  }
  if ((sumEven + sumOdd) % 10 == 0) return true
  else return false;
}





