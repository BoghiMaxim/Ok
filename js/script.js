let products = [];

fetch("produse.json")
  .then(res => res.json())
  .then(data => {
    products = data;
    renderProducts("femei"); // sau ce ai tu
  });

let cart = [];

/* render products */
function renderProducts(category = "all") {
  const grid = document.getElementById("prodGrid");
  if (!grid) return;

  const filtered = category === "all"
    ? products
    : products.filter(product => product.category === category);

  grid.innerHTML = filtered.map(product => `
    <article class="product-card reveal visible">
      <div class="product-image">
        <img src="${product.image}" class="prod-img" alt="${product.name}">
        <span class="product-badge">${product.badge}</span>
      </div>

      <div class="product-content">
        <div class="product-top">
          <h3 class="product-name">${product.name}</h3>
          <div class="product-price">${product.price} MDL</div>
        </div>
        <p class="product-text">${product.desc}</p>
        <p class="product-text">${product.colors}</p>

        <div class="product-actions">
          <button class="btn-outline-small" onclick="showToast('Ai salvat produsul la favorite')">♡ Favorit</button>
          <button class="btn-buy" onclick="addToCart(${product.id})">Adauga</button>
        </div>
      </div>
    </article>
  `).join("");
}

function filterProducts(category, button) {
  renderProducts(category);

  document.querySelectorAll(".filter-tab").forEach(tab => {
    tab.classList.remove("active");
  });

  if (button) {
    button.classList.add("active");
  }
}

/* cart */
function isLoggedIn() {
  return !!localStorage.getItem('loggedUser');
}

function addToCart(id) {
  if (!isLoggedIn()) {
    showAuthModal(id);
    return;
  }

  const product = products.find(item => item.id === id);
  if (!product) return;

  cart.push(product);
  updateCart();
  openCart();
  showToast('✓ Produs adaugat in cos');
}

function showAuthModal(pendingProductId) {
  const modal = document.getElementById('authModal');
  if (modal) {
    modal.dataset.pendingProduct = pendingProductId || '';
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeAuthModal() {
  const modal = document.getElementById('authModal');
  if (modal) {
    modal.classList.remove('active');
    modal.dataset.pendingProduct = '';
    document.body.style.overflow = '';
  }
}

function goToLogin() {
  closeAuthModal();
  window.location.href = 'login.html';
}

function goToRegister() {
  closeAuthModal();
  window.location.href = 'register.html';
}

function continueAsGuest() {
  const modal = document.getElementById('authModal');
  const id = parseInt(modal?.dataset.pendingProduct);
  closeAuthModal();
  if (id) {
    const product = products.find(item => item.id === id);
    if (!product) return;
    cart.push(product);
    updateCart();
    openCart();
    showToast('✓ Produs adaugat in cos');
  }
}

function updateCart() {
  const cartBody = document.getElementById("cartBody");
  const cartCount = document.getElementById("cartCount");
  const cartTotal = document.getElementById("cartTotal");

  if (!cartBody || !cartCount || !cartTotal) return;

  cartCount.textContent = cart.length;

  if (cart.length === 0) {
    cartBody.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛍</div>
        <p>Cosul tau este gol.<br>Adauga produse pentru a incepe.</p>
      </div>
    `;
    cartTotal.textContent = "0 MDL";
    return;
  }

  let total = 0;
  cart.forEach(item => total += item.price);
  cartTotal.textContent = total + " MDL";

  cartBody.innerHTML = cart.map((item, index) => `
    <div class="cart-item">
      <div class="cart-thumb" style="background:${item.gradient}"></div>
      <div>
        <div class="cart-item-title">${item.name}</div>
        <div class="cart-item-meta">${item.category} · ${item.colors}</div>
      </div>
      <div>
        <div class="cart-item-price">${item.price} MDL</div>
        <button class="btn-outline-small" style="margin-top:8px; padding:6px 10px;" onclick="removeFromCart(${index})">Sterge</button>
      </div>
    </div>
  `).join("");
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
  showToast("Produs eliminat din cos");
}

function openCart() {
  const drawer = document.getElementById("cartDrawer");
  const overlay = document.getElementById("cartOverlay");
  if (drawer) drawer.classList.add("active");
  if (overlay) overlay.classList.add("active");
}

function closeCart() {
  const drawer = document.getElementById("cartDrawer");
  const overlay = document.getElementById("cartOverlay");
  if (drawer) drawer.classList.remove("active");
  if (overlay) overlay.classList.remove("active");
}

/* search */
function openSearch() {
  const overlay = document.getElementById("searchOverlay");
  if (overlay) overlay.classList.add("active");
}

function closeSearch() {
  const overlay = document.getElementById("searchOverlay");
  if (overlay) overlay.classList.remove("active");
}

function setSearch(value) {
  const input = document.getElementById("searchInput");
  if (input) {
    input.value = value;
    input.focus();
  }
  showToast("Cautare selectata: " + value);
}

/* toast */
function showToast(message) {
  const toast = document.getElementById("toast");
  const toastMsg = document.getElementById("toastMsg");
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.add("show");

  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

/* newsletter */
function subscribeNewsletter() {
  const emailInput = document.getElementById("emailInput");
  if (!emailInput) return;

  const email = emailInput.value.trim();

  if (email === "") {
    showToast("Introdu o adresa de email");
    return;
  }

  if (!email.includes("@") || !email.includes(".")) {
    showToast("Email invalid");
    return;
  }

  showToast("Te-ai abonat cu succes");
  emailInput.value = "";
}

/* back to top */
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

/* scroll progress + button */
window.addEventListener("scroll", () => {
  const scrollTop = document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

  const bar = document.getElementById("scroll-progress");
  if (bar) {
    bar.style.width = progress + "%";
  }

  const backTop = document.getElementById("back-top");
  if (backTop) {
    if (scrollTop > 300) {
      backTop.classList.add("show");
    } else {
      backTop.classList.remove("show");
    }
  }
});

/* reveal animation */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, {
  threshold: 0.12
});

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

/* custom cursor */
const cursor = document.getElementById("cursor");
const cursorRing = document.getElementById("cursor-ring");

window.addEventListener("mousemove", (e) => {
  if (cursor) {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
  }

  if (cursorRing) {
    cursorRing.style.left = e.clientX + "px";
    cursorRing.style.top = e.clientY + "px";
  }
});

document.querySelectorAll("a, button, .search-tag").forEach(el => {
  el.addEventListener("mouseenter", () => {
    if (cursorRing) {
      cursorRing.style.width = "48px";
      cursorRing.style.height = "48px";
      cursorRing.style.borderColor = "rgba(139, 94, 60, 0.7)";
    }
  });

  el.addEventListener("mouseleave", () => {
    if (cursorRing) {
      cursorRing.style.width = "34px";
      cursorRing.style.height = "34px";
      cursorRing.style.borderColor = "rgba(139, 94, 60, 0.35)";
    }
  });
});

/* close overlays with escape */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeSearch();
    closeCart();
  }
});

/* close search on background click */
document.addEventListener("click", (e) => {
  const searchOverlay = document.getElementById("searchOverlay");
  if (searchOverlay && e.target === searchOverlay) {
    closeSearch();
  }
});

/* init */
renderProducts();
updateCart();
// ================= REGISTER =================

const registerBtn = document.querySelector("#registerBtn");

if (registerBtn) {
  registerBtn.addEventListener("click", function () {
    const nume = document.querySelector("#nume").value;
    const prenume = document.querySelector("#prenume").value;
    const email = document.querySelector("#email").value;
    const telefon = document.querySelector("#telefon").value;
    const parola = document.querySelector("#parola").value;
    const confirmareParola = document.querySelector("#confirmareParola").value;
    const msg = document.querySelector("#msg");

    if (!nume || !prenume || !email || !telefon || !parola || !confirmareParola) {
      afisare(msg, "Completeaza toate campurile", "red");
      return;
    }

    if (!email.includes("@")) {
      afisare(msg, "Email invalid", "red");
      return;
    }

    if (parola.length < 8) {
      afisare(msg, "Parola minim 8 caractere", "red");
      return;
    }

    if (parola !== confirmareParola) {
      afisare(msg, "Parolele nu coincid", "red");
      return;
    }

    if (!/^[0-9]+$/.test(telefon)) {
      afisare(msg, "Telefon invalid", "red");
      return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.find(u => u.email === email)) {
      afisare(msg, "Email deja existent", "red");
      return;
    }

    users.push({ nume, prenume, email, telefon, parola });

    localStorage.setItem("users", JSON.stringify(users));

    afisare(msg, "Cont creat cu succes", "green");
  });
}

// ================= LOGIN =================

const loginBtn = document.querySelector("#loginBtn");

if (loginBtn) {
  loginBtn.addEventListener("click", function () {
    const email = document.querySelector("#loginEmail").value;
    const parola = document.querySelector("#loginParola").value;
    const msg = document.querySelector("#loginMsg");

    let users = JSON.parse(localStorage.getItem("users")) || [];

    let user = users.find(u => u.email === email && u.parola === parola);

    if (user) {
      afisare(msg, "Login reusit", "green");

      localStorage.setItem("loggedUser", JSON.stringify(user));

      setTimeout(() => {
        window.location.href = "index.html";
      }, 1000);
    } else {
      afisare(msg, "Date gresite", "red");
    }
  });
}

// ================= HELPER =================

function afisare(el, text, color) {
  el.innerText = text;
  el.style.color = color;
}

/* ── UPDATE NAV FOR LOGGED USER ── */
function updateNavForUser() {
  const user = JSON.parse(localStorage.getItem('loggedUser') || 'null');
  const accountBtn = document.getElementById('accountBtn');
  const loginLink = document.querySelector('a.login-btn');
  if (!accountBtn) return;

  if (user) {
    accountBtn.innerHTML = `👤 ${user.prenume || user.nume || 'Cont'}`;
    accountBtn.title = 'Contul meu';
    accountBtn.onclick = () => window.location.href = 'cont.html';
    if (loginLink) loginLink.style.display = 'none';
  } else {
    accountBtn.innerHTML = '👤';
    accountBtn.onclick = () => window.location.href = 'login.html';
  }
}

updateNavForUser();


/* ── CHECKOUT ── */
function goToCheckout() {
  if (!isLoggedIn()) { showAuthModal(null); return; }
  if (cart.length === 0) { showToast('Cosul tau este gol'); return; }
  window.location.href = 'checkout.html';
}

/* ── WISHLIST ── */
function toggleWishlist(id, btn) {
  const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
  const idx = favs.indexOf(id);
  if (idx === -1) {
    favs.push(id);
    showToast('Adaugat la favorite ❤️');
    if (btn) { btn.textContent = '❤️'; btn.style.color = '#e04040'; }
  } else {
    favs.splice(idx, 1);
    showToast('Eliminat din favorite');
    if (btn) { btn.textContent = '♡'; btn.style.color = ''; }
  }
  localStorage.setItem('favorites', JSON.stringify(favs));
}

/* ── PRODUCT CARD CLICK → PRODUS PAGE ── */
function goToProduct(id) {
  window.location.href = 'produs.html?id=' + id;
}
