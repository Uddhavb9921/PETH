# 🌾 FreshVeg - Online Vegetable Order System

A modern, full-stack web application for ordering fresh vegetables online with an attractive portal interface.

## Features

✨ **Customer Features:**
- Browse fresh vegetables with beautiful product cards
- Real-time stock availability
- Advanced search and filtering by category
- Shopping cart with quantity management
- Customer registration and login
- Seamless checkout process
- Order tracking
- Multiple payment options (COD, UPI, Card)

🛠️ **Admin Features:**
- Add/Edit/Delete vegetables
- Manage product inventory
- Track orders
- View customer statistics
- Update order status

📱 **Design:**
- Responsive, mobile-friendly interface
- Attractive green theme with smooth animations
- Emoji-based product images
- Intuitive user experience

## Technology Stack

**Backend:**
- Node.js
- Express.js
- CORS for cross-origin requests
- JSON file-based database (easily upgradable to MongoDB/PostgreSQL)

**Frontend:**
- HTML5
- CSS3 (with CSS Grid and Flexbox)
- Vanilla JavaScript
- LocalStorage for cart persistence

## Project Structure

```
PETH/
├── server/
│   └── app.js              # Express server with all API routes
├── public/
│   ├── index.html          # Main portal interface
│   ├── css/
│   │   └── style.css       # All styling
│   └── js/
│       └── app.js          # Frontend logic
├── data/
│   ├── vegetables.json     # Product database
│   ├── orders.json         # Orders database
│   └── customers.json      # Customers database
└── package.json            # Node dependencies

```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Steps to Run

1. **Navigate to the project directory:**
   ```bash
   cd c:\Users\LENOVO\Desktop\PETH
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   - Navigate to `http://localhost:5000`
   - The server will run on port 5000

## API Endpoints

### Vegetables
- `GET /api/vegetables` - Get all vegetables
- `GET /api/vegetables/:id` - Get single vegetable
- `POST /api/vegetables` - Add new vegetable (Admin)
- `PUT /api/vegetables/:id` - Update vegetable (Admin)
- `DELETE /api/vegetables/:id` - Delete vegetable (Admin)

### Customers
- `POST /api/customers/register` - Register new customer
- `GET /api/customers/:id` - Get customer details
- `PUT /api/customers/:id` - Update customer info

### Orders
- `POST /api/orders` - Place new order
- `GET /api/orders/:id` - Get order details
- `GET /api/orders/customer/:customerId` - Get customer's orders
- `PUT /api/orders/:id/status` - Update order status (Admin)
- `GET /api/orders` - Get all orders (Admin)

### Statistics
- `GET /api/stats` - Get dashboard statistics

## Usage Guide

### For Customers

1. **Browse Products:** Scroll through fresh vegetables with emoji icons
2. **Search:** Use the search bar to find specific vegetables
3. **Filter:** Filter by category (All, Vegetables, Leafy Greens)
4. **Add to Cart:** Select quantity and click "Add to Cart"
5. **View Cart:** Click the cart icon to review items
6. **Checkout:**
   - Login or register
   - Enter delivery address
   - Select payment method
   - Place order
7. **Track Orders:** View order history and estimated delivery dates

### For Admins

**Add New Product:**
```bash
curl -X POST http://localhost:3000/api/vegetables \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Cabbage",
    "category": "Vegetables",
    "price": 25,
    "unit": "kg",
    "image": "cabbage.jpg",
    "description": "Fresh green cabbage",
    "stock": 100,
    "rating": 4.3
  }'
```

**Update Order Status:**
```bash
curl -X PUT http://localhost:3000/api/orders/order-{orderId}/status \
  -H "Content-Type: application/json" \
  -d '{"status": "Delivered"}'
```

## Database Schema

### Vegetables
```json
{
  "id": "veg-001",
  "name": "Tomato",
  "category": "Vegetables",
  "price": 50,
  "unit": "kg",
  "image": "tomato.jpg",
  "description": "Fresh red tomatoes",
  "stock": 100,
  "rating": 4.5
}
```

### Orders
```json
{
  "id": "order-xxx",
  "customerId": "cust-xxx",
  "items": [
    {
      "vegetableId": "veg-001",
      "quantity": 2
    }
  ],
  "totalAmount": 150,
  "deliveryAddress": "123 Main St",
  "phone": "9876543210",
  "status": "Pending",
  "createdAt": "2024-01-01T10:00:00Z",
  "estimatedDelivery": "2024-01-03T10:00:00Z"
}
```

### Customers
```json
{
  "id": "cust-xxx",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "address": "123 Main St",
  "createdAt": "2024-01-01T10:00:00Z",
  "totalOrders": 5,
  "totalSpent": 2500
}
```

## Features Demonstration

### Pre-loaded Products
The system comes with 8 popular vegetables:
- 🍅 Tomato (₹50/kg)
- 🥔 Potato (₹30/kg)
- 🥕 Carrot (₹40/kg)
- 🧅 Onion (₹35/kg)
- 🥒 Cucumber (₹45/kg)
- 🥬 Spinach (₹60/bunch)
- 🫑 Bell Pepper (₹70/kg)
- 🥦 Broccoli (₹65/kg)

## Customization

### Change Colors
Edit `public/css/style.css` and modify CSS variables:
```css
:root {
    --primary-color: #22c55e;      /* Main green */
    --secondary-color: #16a34a;    /* Dark green */
    --accent-color: #f59e0b;       /* Orange */
}
```

### Change Port
Edit `server/app.js`:
```javascript
const PORT = 3000; // Change this
```

### Upgrade Database
Replace JSON file operations with MongoDB or PostgreSQL:
- Update the `readFile()` and `writeFile()` functions in `server/app.js`
- Install database driver: `npm install mongoose` or `npm install pg`

## Future Enhancements

- Payment gateway integration (Stripe, Razorpay)
- Email notifications for orders
- SMS delivery tracking
- Seasonal offers and discounts
- Customer reviews and ratings
- Inventory management dashboard
- Real-time order tracking with GPS
- Push notifications
- Multi-language support
- Subscription-based weekly baskets

## Troubleshooting

**Port 3000 already in use:**
```bash
# Change port in server/app.js or kill the process
# On Windows PowerShell:
netstat -ano | findstr :3000
taskkill /PID {PID} /F
```

**Module not found errors:**
```bash
npm install
```

**CORS errors:**
The server already has CORS enabled for all origins. If you get CORS errors:
- Ensure the API_URL in `public/js/app.js` matches your server URL
- Check that the server is running

**Cannot connect to server:**
- Verify server is running: Check terminal output for "🌾 Vegetable Order System running"
- Check if port 3000 is blocked by firewall
- Try accessing `http://localhost:3000` in browser

## License

MIT License - Feel free to use and modify!

## Support

For issues or questions:
- 📧 Email: support@freshveg.com
- 📞 Phone: +91 98765 43210
- 💬 Website: www.freshveg.com

---

Made with 💚 for fresh vegetables! 🥬🥕🍅
