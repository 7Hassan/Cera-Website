
function cartIconClicker(ele) {
  if (userIcon.classList.contains('active')) {
    userIcon.classList.remove('active')
    holderDivUser.classList.remove('show')
  }
  ele.classList.toggle('active')
  productsCart.classList.toggle('show')
}

function userIconClicker(ele) {
  if (cartIcon.classList.contains('active')) {
    cartIcon.classList.remove('active');
    productsCart.classList.remove('show');
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