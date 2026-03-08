/* CUSTOM CURSOR */
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const cur = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cur.style.left = mx + 'px';
    cur.style.top  = my + 'px';
  });

  (function loop() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(loop);
  })();

  document.querySelectorAll('a, button, .cat-card, .product-card, .swatch').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cur.style.width  = '20px'; cur.style.height  = '20px';
      ring.style.width = '52px'; ring.style.height = '52px';
      ring.style.opacity = '.3';
    });
    el.addEventListener('mouseleave', () => {
      cur.style.width  = '10px'; cur.style.height  = '10px';
      ring.style.width = '36px'; ring.style.height = '36px';
      ring.style.opacity = '.6';
    });
  });
}

/* NAV SCROLL */
window.addEventListener('scroll', () => {
  document.getElementById('mainNav').classList.toggle('scrolled', window.scrollY > 60);
});

/* MOBILE MENU */
let mOpen = false;

function toggleMobile() {
  mOpen = !mOpen;
  document.getElementById('hamburger').classList.toggle('open', mOpen);
  const mn = document.getElementById('mobileNav');
  mn.style.display = 'flex';
  requestAnimationFrame(() => mn.classList.toggle('open', mOpen));
  document.body.style.overflow = mOpen ? 'hidden' : '';
}

function closeMobile() {
  mOpen = false;
  document.getElementById('hamburger').classList.remove('open');
  document.getElementById('mobileNav').classList.remove('open');
  document.body.style.overflow = '';
}

/* SCROLL REVEAL */
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => observer.observe(el));

/* CART */
let cart = [], cartCount = 0;

const productImages = [
  'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=120&q=60',
  'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=120&q=60',
  'https://images.unsplash.com/photo-1549497538-303791108f95?w=120&q=60',
  'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=120&q=60',
  'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=120&q=60',
  'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=120&q=60',
];

function toggleCart() {
  document.getElementById('cartDrawer').classList.toggle('open');
  document.getElementById('cartOverlay').classList.toggle('open');
}

function addToCart(name, price, variant, btn) {
  const existing = cart.find(i => i.name === name && i.variant === variant);
  existing ? existing.qty++ : cart.push({ name, price, variant, qty: 1 });

  cartCount = cart.reduce((sum, i) => sum + i.qty, 0);
  document.getElementById('cartCount').textContent = cartCount;
  document.getElementById('mobileCartCount').textContent = cartCount;

  renderCart();
  showToast(name + ' added to cart');

  const original = btn.textContent;
  btn.textContent = '✓ Added';
  btn.style.background = 'var(--sage)';
  setTimeout(() => { btn.textContent = original; btn.style.background = ''; }, 1400);
}

function renderCart() {
  const el = document.getElementById('cartItems');

  if (!cart.length) {
    el.innerHTML = '<p style="color:var(--stone);text-align:center;margin-top:48px;font-style:italic;font-family:\'Cormorant Garamond\',serif;font-size:18px;">Your cart is empty</p>';
    document.getElementById('cartTotal').textContent = '$0';
    return;
  }

  let total = 0;
  el.innerHTML = cart.map((item, i) => {
    total += item.price * item.qty;
    return `
      <div class="cart-item">
        <img src="${productImages[i % productImages.length]}" alt="${item.name}"/>
        <div class="ci-info">
          <div>
            <div class="ci-name">${item.name}</div>
            <div class="ci-variant">${item.variant}</div>
          </div>
          <div class="ci-bottom">
            <div class="ci-qty">
              <button onclick="changeQty(${i}, -1)">−</button>
              <span>${item.qty}</span>
              <button onclick="changeQty(${i}, 1)">+</button>
            </div>
            <span class="ci-price">$${(item.price * item.qty).toLocaleString()}</span>
          </div>
        </div>
      </div>`;
  }).join('');

  document.getElementById('cartTotal').textContent = '$' + total.toLocaleString();
}

function changeQty(index, delta) {
  cart[index].qty = Math.max(0, cart[index].qty + delta);
  if (cart[index].qty === 0) cart.splice(index, 1);

  cartCount = cart.reduce((sum, i) => sum + i.qty, 0);
  document.getElementById('cartCount').textContent = cartCount;
  document.getElementById('mobileCartCount').textContent = cartCount;
  renderCart();
}

/* TOAST */
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

/* SWATCHES */
document.querySelectorAll('.product-swatch').forEach(group => {
  group.querySelectorAll('.swatch').forEach(swatch => {
    swatch.addEventListener('click', () => {
      group.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
    });
  });
});