// ============ STATE MANAGEMENT ============
let vegetables = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentCustomer = JSON.parse(localStorage.getItem('currentCustomer')) || null;
let filteredVegetables = [];

const API_URL = 'http://localhost:5000/api';

// ============ INITIALIZATION ============
document.addEventListener('DOMContentLoaded', () => {
    loadVegetables();
    updateCartDisplay();
    setupEventListeners();
    updateLoginButton();
});

// ============ EVENT LISTENERS ============
function setupEventListeners() {
    // Cart button
    document.getElementById('cartBtn').addEventListener('click', openCart);

    // Login button
    document.getElementById('loginBtn').addEventListener('click', () => {
        if (currentCustomer) {
            logout();
        } else {
            openLogin();
        }
    });

    // Login form
    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        // Simple login simulation - in production, use proper authentication
        currentCustomer = { email, id: 'cust-' + Date.now() };
        localStorage.setItem('currentCustomer', JSON.stringify(currentCustomer));
        closeLogin();
        updateLoginButton();
        alert('Login successful!');
    });

    // Register form
    document.getElementById('registerForm').addEventListener('submit', (e) => {
        e.preventDefault();
        registerCustomer();
    });

    // Checkout form
    document.getElementById('checkoutForm').addEventListener('submit', (e) => {
        e.preventDefault();
        submitOrder();
    });
}

// ============ LOAD VEGETABLES ============
async function loadVegetables() {
    try {
        const response = await fetch(`${API_URL}/vegetables`);
        vegetables = await response.json();
        filteredVegetables = vegetables;
        displayProducts(vegetables);
    } catch (error) {
        console.error('Error loading vegetables:', error);
        alert('Failed to load vegetables. Make sure the server is running.');
    }
}

// ============ DISPLAY PRODUCTS ============
function displayProducts(products) {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';

    if (products.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No products found</p>';
        return;
    }

    products.forEach(veg => {
        const card = createProductCard(veg);
        grid.appendChild(card);
    });
}

function createProductCard(vegetable) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    // Emoji mapping for vegetables
    const emojiMap = {
        'Tomato': '🍅',
        'Potato': '🥔',
        'Carrot': '🥕',
        'Onion': '🧅',
        'Cucumber': '🥒',
        'Spinach': '🥬',
        'Bell Pepper': '🫑',
        'Broccoli': '🥦'
    };

    const emoji = emojiMap[vegetable.name] || '🥬';
    const isOutOfStock = vegetable.stock === 0;

    card.innerHTML = `
        <div class="product-image">${emoji}</div>
        <div class="product-info">
            <div class="product-name">${vegetable.name}</div>
            <div class="product-category">${vegetable.category}</div>
            <div class="product-description">${vegetable.description}</div>
            <div class="product-rating">⭐ ${vegetable.rating}/5</div>
            <div class="product-price">₹${vegetable.price}/${vegetable.unit}</div>
            <div class="product-stock">Stock: ${vegetable.stock > 0 ? vegetable.stock + ' ' + vegetable.unit : 'Out of Stock'}</div>
            <div class="product-actions">
                <div class="quantity-selector">
                    <button class="qty-btn" onclick="decreaseQty(this)">−</button>
                    <input type="number" class="qty-input" value="1" min="1" max="${vegetable.stock}">
                    <button class="qty-btn" onclick="increaseQty(this)">+</button>
                </div>
                <button class="add-to-cart-btn" onclick="addToCart('${vegetable.id}', this)" ${isOutOfStock ? 'disabled' : ''}>
                    ${isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                </button>
            </div>
        </div>
    `;
    return card;
}

// ============ QUANTITY CONTROLS ============
function increaseQty(btn) {
    const input = btn.parentElement.querySelector('.qty-input');
    const max = parseInt(input.max) || 999;
    if (parseInt(input.value) < max) {
        input.value = parseInt(input.value) + 1;
    }
}

function decreaseQty(btn) {
    const input = btn.parentElement.querySelector('.qty-input');
    if (parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
    }
}

// ============ CART MANAGEMENT ============
function addToCart(vegetableId, btn) {
    const quantityInput = btn.parentElement.previousElementSibling.querySelector('.qty-input');
    const quantity = parseInt(quantityInput.value);

    if (quantity <= 0) {
        alert('Please select a quantity');
        return;
    }

    const vegetable = vegetables.find(v => v.id === vegetableId);
    if (!vegetable) {
        alert('Product not found');
        return;
    }

    // Check if already in cart
    const existingItem = cart.find(item => item.vegetableId === vegetableId);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            vegetableId: vegetableId,
            name: vegetable.name,
            price: vegetable.price,
            unit: vegetable.unit,
            quantity: quantity
        });
    }

    saveCart();
    updateCartDisplay();
    alert('Added to cart!');
    quantityInput.value = 1; // Reset quantity
}

function updateCartDisplay() {
    const cartCount = document.getElementById('cartCount');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Update local storage
    localStorage.setItem('cart', JSON.stringify(cart));
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function removeFromCart(vegetableId) {
    cart = cart.filter(item => item.vegetableId !== vegetableId);
    saveCart();
    updateCartDisplay();
    displayCart();
}

function updateCartItemQuantity(vegetableId, newQuantity) {
    const item = cart.find(item => item.vegetableId === vegetableId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(vegetableId);
        } else {
            item.quantity = newQuantity;
            saveCart();
            displayCart();
        }
    }
}

function displayCart() {
    const cartItemsContainer = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align: center; padding: 2rem;">Your cart is empty</p>';
        updateTotals();
        return;
    }

    let html = '';
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        html += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">₹${item.price}/${item.unit}</div>
                </div>
                <div class="cart-item-quantity">
                    <button onclick="updateCartItemQuantity('${item.vegetableId}', ${item.quantity - 1})">−</button>
                    <input type="number" value="${item.quantity}" min="1" onchange="updateCartItemQuantity('${item.vegetableId}', this.value)">
                    <button onclick="updateCartItemQuantity('${item.vegetableId}', ${item.quantity + 1})">+</button>
                </div>
                <div style="font-weight: bold; margin-right: 1rem; width: 80px; text-align: right;">₹${itemTotal}</div>
                <div class="cart-item-actions">
                    <button class="remove-btn" onclick="removeFromCart('${item.vegetableId}')">Remove</button>
                </div>
            </div>
        `;
    });
    cartItemsContainer.innerHTML = html;
    updateTotals();
}

function updateTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const delivery = 50;
    const total = subtotal + delivery;

    document.getElementById('subtotal').textContent = '₹' + subtotal;
    document.getElementById('delivery').textContent = '₹' + delivery;
    document.getElementById('total').textContent = '₹' + total;
}

// ============ CART MODAL ============
function openCart() {
    displayCart();
    document.getElementById('cartModal').classList.add('active');
}

function closeCart() {
    document.getElementById('cartModal').classList.remove('active');
}

function checkout() {
    if (!currentCustomer) {
        alert('Please login first');
        closeCart();
        openLogin();
        return;
    }

    if (cart.length === 0) {
        alert('Your cart is empty');
        return;
    }

    displayCheckoutSummary();
    closeCart();
    document.getElementById('checkoutModal').classList.add('active');
}

function displayCheckoutSummary() {
    const summary = document.getElementById('checkoutSummary');
    let html = '<div style="background: #f9fafb; padding: 1rem; border-radius: 4px;">';
    
    cart.forEach(item => {
        html += `<p style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <span>${item.name} x ${item.quantity}</span>
            <span>₹${item.price * item.quantity}</span>
        </p>`;
    });

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const delivery = 50;
    const total = subtotal + delivery;

    html += `
        <hr style="margin: 1rem 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="display: flex; justify-content: space-between; font-weight: bold;">
            <span>Subtotal:</span>
            <span>₹${subtotal}</span>
        </p>
        <p style="display: flex; justify-content: space-between; font-weight: bold;">
            <span>Delivery:</span>
            <span>₹${delivery}</span>
        </p>
        <p style="display: flex; justify-content: space-between; font-weight: bold; color: #22c55e; font-size: 1.1rem; margin-top: 0.5rem;">
            <span>Total:</span>
            <span>₹${total}</span>
        </p>
    </div>`;

    summary.innerHTML = html;
}

function closeCheckout() {
    document.getElementById('checkoutModal').classList.remove('active');
}

// ============ ORDER SUBMISSION ============
async function submitOrder() {
    if (!currentCustomer) {
        alert('Please login first');
        return;
    }

    const name = document.getElementById('checkoutName').value;
    const phone = document.getElementById('checkoutPhone').value;
    const address = document.getElementById('checkoutAddress').value;

    if (!name || !phone || !address) {
        alert('Please fill all fields');
        return;
    }

    const orderData = {
        customerId: currentCustomer.id,
        items: cart.map(item => ({
            vegetableId: item.vegetableId,
            quantity: item.quantity
        })),
        deliveryAddress: address,
        phone: phone
    };

    try {
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        const order = await response.json();

        if (!response.ok) {
            alert('Error: ' + (order.error || 'Failed to place order'));
            return;
        }

        // Clear cart
        cart = [];
        saveCart();
        updateCartDisplay();

        // Show success modal
        document.getElementById('orderIdDisplay').textContent = order.id;
        const deliveryDate = new Date(order.estimatedDelivery);
        document.getElementById('deliveryDateDisplay').textContent = deliveryDate.toLocaleDateString();

        closeCheckout();
        document.getElementById('successModal').classList.add('active');

        // Reload vegetables to update stock
        loadVegetables();
    } catch (error) {
        console.error('Error placing order:', error);
        alert('Failed to place order. Please try again.');
    }
}

// ============ CUSTOMER AUTHENTICATION ============
function openLogin() {
    document.getElementById('loginModal').classList.add('active');
}

function closeLogin() {
    document.getElementById('loginModal').classList.remove('active');
}

function switchTab(tab) {
    if (tab === 'login') {
        document.getElementById('loginForm').style.display = 'flex';
        document.getElementById('registerForm').style.display = 'none';
    } else {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('registerForm').style.display = 'flex';
    }

    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

async function registerCustomer() {
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const phone = document.getElementById('regPhone').value;
    const address = document.getElementById('regAddress').value;

    try {
        const response = await fetch(`${API_URL}/customers/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, phone, address })
        });

        const customer = await response.json();

        if (!response.ok) {
            alert('Error: ' + (customer.error || 'Registration failed'));
            return;
        }

        currentCustomer = customer;
        localStorage.setItem('currentCustomer', JSON.stringify(customer));
        closeLogin();
        updateLoginButton();
        alert('Registration successful!');
    } catch (error) {
        console.error('Error registering customer:', error);
        alert('Registration failed');
    }
}

function updateLoginButton() {
    const loginBtn = document.getElementById('loginBtn');
    if (currentCustomer) {
        loginBtn.textContent = `👤 ${currentCustomer.name || currentCustomer.email}`;
    } else {
        loginBtn.textContent = 'Login';
    }
}

function logout() {
    currentCustomer = null;
    localStorage.removeItem('currentCustomer');
    updateLoginButton();
    alert('Logged out successfully');
}

// ============ FILTERING & SEARCHING ============
function filterByCategory(category) {
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    if (category === 'all') {
        filteredVegetables = vegetables;
    } else {
        filteredVegetables = vegetables.filter(v => v.category === category);
    }
    displayProducts(filteredVegetables);
}

function searchVegetables() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    filteredVegetables = vegetables.filter(v =>
        v.name.toLowerCase().includes(searchTerm) ||
        v.description.toLowerCase().includes(searchTerm)
    );
    displayProducts(filteredVegetables);
}

// Close modals when clicking outside
window.onclick = function(event) {
    const loginModal = document.getElementById('loginModal');
    const cartModal = document.getElementById('cartModal');
    const checkoutModal = document.getElementById('checkoutModal');
    const successModal = document.getElementById('successModal');

    if (event.target === loginModal) {
        closeLogin();
    }
    if (event.target === cartModal) {
        closeCart();
    }
    if (event.target === checkoutModal) {
        closeCheckout();
    }
    if (event.target === successModal) {
        location.reload();
    }
}
