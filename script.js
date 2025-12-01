// Header Section Start
document.addEventListener('DOMContentLoaded', function () {
  const closeBtn = document.getElementById('closeHeader-button');
  const header = document.getElementById('header_start');
  closeBtn.addEventListener('click', function () {
    header.style.transition = 'all 0.2s ease';
    header.style.height = '0';
    header.style.padding = '0';
    header.style.overflow = 'hidden';
    setTimeout(() => {
      header.style.display = 'none';
    }, 200);
  });
});
// Header Section Close ///////////////////////////////////////////////////////////////

// Start Navigation Section 
// Desktop Screen Navigation (Hover dropdown on desktop only)
document.querySelectorAll('.navbar .dropdown').forEach(drop => {
  const link = drop.querySelector('.nav-link');
  const menu = drop.querySelector('.dropdown-menu');

  drop.addEventListener('mouseenter', () => {
    if (window.innerWidth >= 992) {
      drop.classList.add('show');
      menu.classList.add('show');
      link.setAttribute('aria-expanded', 'true');
    }
  });

  drop.addEventListener('mouseleave', () => {
    if (window.innerWidth >= 992) {
      drop.classList.remove('show');
      menu.classList.remove('show');
      link.setAttribute('aria-expanded', 'false');
    }
  });
});
// Mobile Screen Navigation
document.querySelectorAll('.navbar .dropdown').forEach(drop => {
  drop.addEventListener('mouseenter', () => { if (window.innerWidth >= 992) drop.classList.add('show'); });
  drop.addEventListener('mouseleave', () => { if (window.innerWidth >= 992) drop.classList.remove('show'); });
});

// OPEN search bar
document.querySelectorAll('#searchToggle').forEach(icon => {
  icon.addEventListener('click', function () {
    if (this.querySelector('.bi-search')) {
      document.getElementById("searchDropdown").style.display = "block";
    }
  });
});
// CLOSE search bar
document.getElementById("closeSearch-button").addEventListener("click", function () {
  document.getElementById("searchDropdown").style.display = "none";
});

// add to cart button 
let cart = JSON.parse(localStorage.getItem('cart') || '[]');

// add product to cart
function addToCart(title, price, img) {
  cart.push({ title, price, img });
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}
function renderCart() {
  const cartContainer = document.getElementById('cartItems');
  const totalPriceEl = document.getElementById('totalPrice');
  const checkoutContainer = document.getElementById('checkoutCanvas');
  const cartCountEl = document.getElementById('cartCount');

  cartContainer.innerHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    // calculate total for this item
    const itemTotal = item.price * (item.quantity || 1);
    total += itemTotal;

    const div = document.createElement('div');
    div.className = 'd-flex align-items-center mb-2';
    div.innerHTML = `
            <img src="${item.img}" width="50" class="me-2 rounded">
            <div class="flex-grow-1">
                <div>${item.title}</div>
                <div>
                    <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${index}, -1)">-</button>
                    <span id="qty-${index}">${item.quantity || 1}</span>
                    <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${index}, 1)">+</button>
                </div>
                <small>Rs <span id="price-${index}">${itemTotal}</span></small>
            </div>
            <button class="btn btn-sm btn-danger" onclick="removeCartItem(${index})">&times;</button>
        `;
    cartContainer.appendChild(div);
  });

  totalPriceEl.textContent = total;
  cartCountEl.textContent = cart.length;

  // Render checkout items dynamically
  let checkoutItems = checkoutContainer.querySelector('#checkoutItems');
  if (!checkoutItems) {
    checkoutItems = document.createElement('div');
    checkoutItems.id = 'checkoutItems';
    checkoutContainer.insertBefore(checkoutItems, checkoutContainer.querySelector('hr').nextSibling);
  }
  checkoutItems.innerHTML = '';
  cart.forEach((item, index) => {
    const itemTotal = item.price * (item.quantity || 1);
    const div = document.createElement('div');
    div.className = 'd-flex align-items-center mb-2';
    div.innerHTML = `
            <img src="${item.img}" width="50" class="me-2 rounded">
            <div class="flex-grow-1">
                <div>${item.title}</div>
                <div>
                    <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${index}, -1)">-</button>
                    <span id="checkout-qty-${index}">${item.quantity || 1}</span>
                    <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${index}, 1)">+</button>
                </div>
                <small>Rs <span id="checkout-price-${index}">${itemTotal}</span></small>
            </div>
        `;
    checkoutItems.appendChild(div);
  });
}
// Update quantity
function updateQuantity(index, delta) {
  if (!cart[index].quantity) cart[index].quantity = 1;
  cart[index].quantity += delta;
  if (cart[index].quantity < 1) cart[index].quantity = 1; // minimum 1

  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}

// checkoutCanvas 
function removeCartItem(index) {
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}

document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  validateCheckoutForm();
});

// Checkout form validation
function validateCheckoutForm() {
  const placeOrderBtn = document.getElementById('placeOrderBtn');
  const checkoutCanvas = document.getElementById('checkoutCanvas');
  const inputs = checkoutCanvas.querySelectorAll('input[required]');
  const thankyou = document.getElementById('thankyou');

  // thank you 
  thankyou.style.display = 'none';
  placeOrderBtn.disabled = true;

  inputs.forEach(input => {
    input.addEventListener('input', () => {
      let allFilled = true;
      inputs.forEach(i => { if (i.value.trim() === '') allFilled = false; });
      placeOrderBtn.disabled = !allFilled;
    });
  });

  placeOrderBtn.addEventListener('click', () => {
    // show thank you message
    thankyou.style.display = 'block';
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    inputs.forEach(i => i.value = '');
    placeOrderBtn.disabled = true;
  });
}


// End  Navigation

// Start Hero Section 
// jQuery Sorting
$("#sortMenu a").click(function () {
  let type = $(this).data("sort");
  let items = $(".item").sort((a, b) => {
    let A = $(a).data(), B = $(b).data();
    if (type == "az") return A.name.localeCompare(B.name);
    if (type == "za") return B.name.localeCompare(A.name);
    if (type == "low") return A.price - B.price;
    if (type == "high") return B.price - A.price;
    if (type == "best") return B.sold - A.sold;
  });
  $("#products").html(items);
});

// Product Model
var cardModal = document.getElementById('cardModal');

cardModal.addEventListener('show.bs.modal', function (event) {
  var button = event.relatedTarget;
  var title = button.getAttribute('data-title');
  var img = button.getAttribute('data-img');
  var desc = button.getAttribute('data-desc');
  var modalTitle = cardModal.querySelector('.modal-title');
  var modalImg = cardModal.querySelector('#cardModalImg');
  var modalDesc = cardModal.querySelector('#cardModalDesc');
  modalTitle.textContent = title;
  modalImg.src = img;
  modalImg.alt = title;
  modalDesc.textContent = desc;
});

// Model Download PDF 
////////////////////////////////////////////////////
const ACCOUNT_PAGE = 'account.html'; // your login page

// Login Check 
function isUserLoggedIn() {
  return localStorage.getItem('userLoggedIn') === '1';
}

// Open modal product info
function openModal(title, img, pdf) {
  document.getElementById('cardModalTitle').textContent = title;
  const imgEl = document.getElementById('cardModalImg');
  imgEl.src = img;
  imgEl.alt = title;

  const downloadBtn = document.getElementById('modalActionBtn');
  downloadBtn.dataset.pdf = pdf;
  downloadBtn.href = pdf || '#';
}

// Download button click 
document.getElementById('modalActionBtn').addEventListener('click', function (e) {
  const pdf = this.dataset.pdf;
  if (!pdf) return;

  if (!isUserLoggedIn()) {
    e.preventDefault();
    const currentPath = window.location.pathname + window.location.search;
    const encodedReturn = encodeURIComponent(currentPath.split('?')[0]);
    const encodedPdf = encodeURIComponent(pdf);
    window.location.href = `${ACCOUNT_PAGE}?return=${encodedReturn}&download=${encodedPdf}`;
    return;
  }

  // logged in → Before Downlaod file
  e.preventDefault();
  const a = document.createElement('a');
  a.href = pdf;
  a.download = pdf.split('/').pop();
  document.body.appendChild(a);
  a.click();
  a.remove();
});

// Auto-download 
document.addEventListener('DOMContentLoaded', function () {
  const params = new URLSearchParams(window.location.search);
  const pdf = params.get('download');
  if (!pdf || !isUserLoggedIn()) return;

  const a = document.createElement('a');
  a.href = decodeURIComponent(pdf);
  a.download = decodeURIComponent(pdf).split('/').pop();
  document.body.appendChild(a);
  a.click();
  a.remove();

  // remove download 
  const url = new URL(window.location);
  url.searchParams.delete('download');
  window.history.replaceState({}, document.title, url.pathname + url.search);
});
