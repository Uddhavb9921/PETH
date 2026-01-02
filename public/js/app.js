// ================== STATE ==================
let vegetables = [];
let cart = [];
let currentCustomer = null;
let filteredVegetables = [];

// Dynamically detect API URL based on current location
const API_URL = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api`;
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

    if (products.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem;">No products found</p>';
        return;
    }

    const emojiMap = {
        'Tomato': '🍅', 'Potato': '🥔', 'Carrot': '🥕', 'Onion': '🧅',
        'Cucumber': '🥒', 'Spinach': '🥬', 'Bell Pepper': '🫑', 'Broccoli': '🥦'
    };

    products.forEach(v => {
        const card = document.createElement('div');
        card.className = 'product-card';
        const emoji = emojiMap[v.name] || '🥬';
        const isOutOfStock = v.stock === 0;

        card.innerHTML = `
            <div class="product-image">${emoji}</div>
            <div class="product-info">
                <div class="product-name">${v.name}</div>
                <div class="product-category">${v.category}</div>
                <div class="product-description">${v.description}</div>
                <div class="product-rating">⭐ ${v.rating || 4.5}/5</div>
                <div class="product-price">₹${v.price}/${v.unit}</div>
                <div class="product-stock ${isOutOfStock ? 'out-of-stock' : 'in-stock'}">
                    Stock: ${isOutOfStock ? 'Out of Stock' : v.stock + ' ' + v.unit}
                </div>
                <div class="product-actions">
                    <div class="quantity-selector">
                        <button class="qty-btn" onclick="changeQty(this,-1)">−</button>
                        <input type="number" class="qty-input" value="1" min="1" max="${v.stock || 1}">
                        <button class="qty-btn" onclick="changeQty(this,1)">+</button>
                    </div>
                    <button class="add-to-cart-btn" onclick="addToCart('${v.id}', this)" ${isOutOfStock ? 'disabled' : ''}>
                        ${isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                </div>
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
function filterByCategory(cat) {
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

// ================== CHECKOUT ==================
function checkout() {
    if (!currentCustomer) {
        alert('Please login first');
        closeCart();
        openLogin();
        return;
    }
    if (cart.length === 0) {
        alert('Cart is empty');
        return;
    }
    closeCart();
    document.getElementById('checkoutModal').classList.add('active');
}

function closeCheckout() {
    document.getElementById('checkoutModal').classList.remove('active');
}

function submitOrder() {
    alert('Order placed! We will contact you soon.');
    cart = [];
    updateCartDisplay();
    closeCheckout();
}

// ================== TAB SWITCHING ==================
function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.form-group').forEach(f => f.style.display = 'none');
    
    event.target.classList.add('active');
    document.getElementById(tab === 'login' ? 'loginForm' : 'registerForm').style.display = 'flex';
}

// ================== REGISTER ==================
function registerCustomer() {
    const name = document.getElementById('regName')?.value;
    const email = document.getElementById('regEmail')?.value;
    const phone = document.getElementById('regPhone')?.value;
    const address = document.getElementById('regAddress')?.value;

    if (!name || !email || !phone || !address) {
        alert('Fill all fields');
        return;
    }

    currentCustomer = { name, email, phone, address, id: 'cust-' + Date.now() };
    localStorage.setItem('currentCustomer', JSON.stringify(currentCustomer));
    closeLogin();
    updateLoginButton();
    alert('Registration successful!');
}
