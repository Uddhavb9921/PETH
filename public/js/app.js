// ================== STATE ==================
let vegetables = [];
let cart = [];
let currentCustomer = null;
let filteredVegetables = [];

const API_URL = 'http://localhost:5000/api';
const WHATSAPP_NUMBER = '919921709556';

// ================== LOCAL STORAGE ==================
if (typeof window !== 'undefined') {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    currentCustomer = JSON.parse(localStorage.getItem('currentCustomer')) || null;
}

// ================== INIT ==================
document.addEventListener('DOMContentLoaded', () => {
    loadVegetables();
    updateCartDisplay();
    setupEventListeners();
    updateLoginButton();
});

// ================== EVENT LISTENERS ==================
function setupEventListeners() {
    document.getElementById('cartBtn')?.addEventListener('click', openCart);
    document.getElementById('loginBtn')?.addEventListener('click', () => {
        currentCustomer ? logout() : openLogin();
    });

    document.getElementById('loginForm')?.addEventListener('submit', e => {
        e.preventDefault();
        const email = loginEmail.value;
        currentCustomer = { email, id: 'cust-' + Date.now() };
        localStorage.setItem('currentCustomer', JSON.stringify(currentCustomer));
        closeLogin();
        updateLoginButton();
        alert('Login successful');
    });

    document.getElementById('registerForm')?.addEventListener('submit', e => {
        e.preventDefault();
        registerCustomer();
    });

    document.getElementById('checkoutForm')?.addEventListener('submit', e => {
        e.preventDefault();
        submitOrder();
    });
}

// ================== LOAD PRODUCTS ==================
async function loadVegetables() {
    try {
        const res = await fetch(`${API_URL}/vegetables`);
        vegetables = await res.json();
        filteredVegetables = vegetables;
        displayProducts(filteredVegetables);
    } catch (e) {
        alert('Server not running');
    }
}

// ================== DISPLAY PRODUCTS ==================
function displayProducts(products) {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';

    products.forEach(v => {
        const card = document.createElement('div');
        card.className = 'product-card';

        card.innerHTML = `
            <div class="product-info">
                <h3>${v.name}</h3>
                <p>${v.description}</p>
                <p><b>₹${v.price}/${v.unit}</b></p>

                <div class="quantity-selector">
                    <button onclick="changeQty(this,-1)">−</button>
                    <input type="number" class="qty-input" value="1" min="1">
                    <button onclick="changeQty(this,1)">+</button>
                </div>

                <button class="add-to-cart-btn"
                    onclick="addToCart('${v.id}', this)"
                    ${v.stock === 0 ? 'disabled' : ''}>
                    ${v.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// ================== QTY ==================
function changeQty(btn, delta) {
    const input = btn.parentElement.querySelector('.qty-input');
    let val = parseInt(input.value) + delta;
    if (val < 1) val = 1;
    input.value = val;
}

// ================== ADD TO CART ==================
function addToCart(id, btn) {
    const card = btn.closest('.product-card');
    const qty = parseInt(card.querySelector('.qty-input').value);
    const veg = vegetables.find(v => v.id === id);

    if (!veg) return alert('Product not found');

    openOrderForm(veg.name, qty, veg.price);
}

// ================== ORDER FORM ==================
function openOrderForm(name, qty, price) {
    orderProductName.value = name;
    orderQuantity.value = qty;
    orderPrice.value = price;

    orderName.value = '';
    orderPhone.value = '';
    orderAddress.value = '';
    orderInstructions.value = '';

    orderFormModal.classList.add('active');
}

function closeOrderForm() {
    orderFormModal.classList.remove('active');
}

function submitOrderForm(e) {
    e.preventDefault();

    const name = orderName.value;
    const phone = orderPhone.value;
    const address = orderAddress.value;
    const product = orderProductName.value;
    const qty = orderQuantity.value;
    const price = orderPrice.value;

    if (!name || !phone || !address) {
        alert('Fill all details');
        return;
    }

    const total = price * qty;

    const msg = `
🛒 *New Order*
👤 ${name}
📱 ${phone}
📍 ${address}

📦 ${product}
Qty: ${qty}
💰 Total: ₹${total}
    `;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

    closeOrderForm();
    window.open(url, '_blank');
}

// ================== CART ==================
function updateCartDisplay() {
    document.getElementById('cartCount').textContent =
        cart.reduce((s, i) => s + i.quantity, 0);
    localStorage.setItem('cart', JSON.stringify(cart));
}

function openCart() {
    cartModal.classList.add('active');
}

function closeCart() {
    cartModal.classList.remove('active');
}

// ================== LOGIN ==================
function openLogin() {
    loginModal.classList.add('active');
}

function closeLogin() {
    loginModal.classList.remove('active');
}

function updateLoginButton() {
    loginBtn.textContent = currentCustomer
        ? `👤 ${currentCustomer.email}`
        : 'Login';
}

function logout() {
    currentCustomer = null;
    localStorage.removeItem('currentCustomer');
    updateLoginButton();
}

// ================== FILTER ==================
function filterByCategory(cat, event) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');

    filteredVegetables = cat === 'all'
        ? vegetables
        : vegetables.filter(v => v.category === cat);

    displayProducts(filteredVegetables);
}

// ================== SEARCH ==================
function searchVegetables() {
    const t = searchInput.value.toLowerCase();
    displayProducts(
        vegetables.filter(v =>
            v.name.toLowerCase().includes(t) ||
            v.description.toLowerCase().includes(t)
        )
    );
}

// ================== CLOSE MODALS ==================
window.onclick = e => {
    ['loginModal','cartModal','orderFormModal']
        .forEach(id => {
            const m = document.getElementById(id);
            if (e.target === m) m.classList.remove('active');
        });
};
