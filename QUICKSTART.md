# 🚀 Quick Start Guide

## Your Vegetable Ordering System is Ready!

### ✅ What's Been Created

1. **Complete Backend Server** (Node.js + Express)
   - RESTful API for products, orders, and customers
   - JSON-based database (can be upgraded to SQL/MongoDB)
   - CORS enabled for frontend communication

2. **Beautiful Frontend Portal**
   - Responsive design (works on mobile, tablet, desktop)
   - Green theme with attractive animations
   - Real-time cart management
   - Customer authentication system

3. **Pre-loaded Data**
   - 8 fresh vegetables with pricing
   - Sample product images (using emojis)
   - Ready-to-use order system

---

## 🎯 How to Use

### Step 1: Start the Server
```bash
cd c:\Users\LENOVO\Desktop\PETH
npm start
```

**Output:**
```
🌾 Vegetable Order System running on http://localhost:5000
📱 Access the portal at http://localhost:5000
```

### Step 2: Open the Portal
- Open browser and go to: **http://localhost:5000**
- You should see the FreshVeg homepage

### Step 3: Try the Features

#### 👥 Register as Customer
1. Click "Login" button
2. Go to "Register" tab
3. Enter your details:
   - Name: Your full name
   - Email: your@email.com
   - Phone: 9876543210
   - Address: Your delivery address
4. Click "Register"

#### 🛒 Order Vegetables
1. Browse products on homepage
2. Click on vegetables to see details
3. Select quantity (using +/- buttons)
4. Click "Add to Cart"
5. Click cart icon (🛒) to review items
6. Click "Proceed to Checkout"
7. Enter delivery details
8. Select payment method (COD by default)
9. Click "Place Order"
10. 🎉 Order confirmed!

#### 🔍 Search & Filter
1. **Search**: Type vegetable name in search box
2. **Filter by Category**: Click category buttons (All, Vegetables, Leafy Greens)

---

## 📊 Available Products

| Product | Price | Category | Stock |
|---------|-------|----------|-------|
| 🍅 Tomato | ₹50/kg | Vegetables | 100 |
| 🥔 Potato | ₹30/kg | Vegetables | 150 |
| 🥕 Carrot | ₹40/kg | Vegetables | 80 |
| 🧅 Onion | ₹35/kg | Vegetables | 200 |
| 🥒 Cucumber | ₹45/kg | Vegetables | 60 |
| 🥬 Spinach | ₹60/bunch | Leafy Greens | 50 |
| 🫑 Bell Pepper | ₹70/kg | Vegetables | 40 |
| 🥦 Broccoli | ₹65/kg | Vegetables | 35 |

---

## 🔗 API Endpoints (For Testing)

### Get All Products
```
GET http://localhost:5000/api/vegetables
```

### Place an Order
```
POST http://localhost:5000/api/orders
Body: {
  "customerId": "cust-123",
  "items": [{"vegetableId": "veg-001", "quantity": 2}],
  "deliveryAddress": "123 Main St",
  "phone": "9876543210"
}
```

### Get Statistics
```
GET http://localhost:5000/api/stats
```

---

## 💾 Data Storage

All data is stored in JSON files:
- `data/vegetables.json` - Products catalog
- `data/customers.json` - Customer information
- `data/orders.json` - Order history

To reset data, simply delete these files and restart the server.

---

## 🎨 Customization Ideas

### Change Theme Colors
Edit `public/css/style.css`:
```css
:root {
    --primary-color: #22c55e;      /* Change green */
    --secondary-color: #16a34a;
    --accent-color: #f59e0b;       /* Change orange */
}
```

### Add More Products
1. Go to `data/vegetables.json`
2. Add new vegetable object:
```json
{
  "id": "veg-009",
  "name": "Lettuce",
  "category": "Leafy Greens",
  "price": 50,
  "unit": "bunch",
  "image": "lettuce.jpg",
  "description": "Fresh green lettuce",
  "stock": 75,
  "rating": 4.4
}
```

### Change Delivery Charge
Edit `public/js/app.js`:
```javascript
const delivery = 50; // Change this value
```

---

## 📱 Features Overview

### ✨ Customer Features
- [x] Browse products with images
- [x] Search and filter vegetables
- [x] Add to cart
- [x] Manage cart quantity
- [x] Customer registration
- [x] Order checkout
- [x] Order confirmation
- [x] Multiple payment options

### 🛠️ Admin Features (API)
- [x] Add new vegetables
- [x] Update product information
- [x] Delete products
- [x] Manage inventory/stock
- [x] View all orders
- [x] Update order status
- [x] View customer statistics

---

## 🔧 Troubleshooting

### Server won't start
```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000

# Kill the process (replace PID)
taskkill /PID 12345 /F

# Try again
npm start
```

### Page shows blank/error
1. Check if server is running in terminal
2. Open browser console (F12) to see errors
3. Verify URL is: `http://localhost:5000`

### Cart not saving
1. Check browser localStorage (F12 > Application > localStorage)
2. Clear cache: Ctrl+Shift+Delete

### API errors
1. Ensure server is running
2. Check API_URL in `public/js/app.js`
3. Look at server terminal for error messages

---

## 📈 Next Steps

### To Add More Features:

1. **Payment Gateway**
   ```bash
   npm install stripe razorpay
   ```

2. **Email Notifications**
   ```bash
   npm install nodemailer
   ```

3. **Database Upgrade**
   ```bash
   npm install mongoose mongodb
   # or
   npm install pg sequelize
   ```

4. **Authentication**
   ```bash
   npm install jwt bcryptjs
   ```

5. **File Upload (for actual product images)**
   ```bash
   npm install multer
   ```

---

## 📞 Support

- **Port**: 5000
- **URL**: http://localhost:5000
- **API**: http://localhost:5000/api
- **Data**: `./data/` directory

---

## ✅ Checklist

- [x] Server created and running
- [x] Database setup (vegetables, customers, orders)
- [x] Frontend portal with responsive design
- [x] Product catalog with 8 vegetables
- [x] Shopping cart functionality
- [x] Customer registration system
- [x] Order placement system
- [x] Search and filter features
- [x] Attractive green theme
- [x] Mobile responsive design
- [x] API endpoints documented
- [x] Ready for deployment!

---

## 🎉 You're All Set!

Open **http://localhost:5000** in your browser and start using your vegetable ordering system!

Enjoy! 🥬🥕🍅
