const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

// File paths
const vegetablesFile = path.join(__dirname, '../data/vegetables.json');
const ordersFile = path.join(__dirname, '../data/orders.json');
const customersFile = path.join(__dirname, '../data/customers.json');

// Helper functions to read/write JSON files
const readFile = (filePath) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
};

const writeFile = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing to ${filePath}:`, error);
    return false;
  }
};

// ==================== VEGETABLES ROUTES ====================

// Get all vegetables
app.get('/api/vegetables', (req, res) => {
  const vegetables = readFile(vegetablesFile);
  res.json(vegetables);
});

// Get single vegetable
app.get('/api/vegetables/:id', (req, res) => {
  const vegetables = readFile(vegetablesFile);
  const vegetable = vegetables.find(v => v.id === req.params.id);
  if (vegetable) {
    res.json(vegetable);
  } else {
    res.status(404).json({ error: 'Vegetable not found' });
  }
});

// Add new vegetable (Admin)
app.post('/api/vegetables', (req, res) => {
  const vegetables = readFile(vegetablesFile);
  const newVegetable = {
    id: 'veg-' + Date.now(),
    ...req.body,
    stock: req.body.stock || 0,
    rating: 0
  };
  vegetables.push(newVegetable);
  if (writeFile(vegetablesFile, vegetables)) {
    res.status(201).json(newVegetable);
  } else {
    res.status(500).json({ error: 'Failed to add vegetable' });
  }
});

// Update vegetable (Admin)
app.put('/api/vegetables/:id', (req, res) => {
  const vegetables = readFile(vegetablesFile);
  const index = vegetables.findIndex(v => v.id === req.params.id);
  if (index !== -1) {
    vegetables[index] = { ...vegetables[index], ...req.body };
    if (writeFile(vegetablesFile, vegetables)) {
      res.json(vegetables[index]);
    } else {
      res.status(500).json({ error: 'Failed to update vegetable' });
    }
  } else {
    res.status(404).json({ error: 'Vegetable not found' });
  }
});

// Delete vegetable (Admin)
app.delete('/api/vegetables/:id', (req, res) => {
  const vegetables = readFile(vegetablesFile);
  const filteredVegetables = vegetables.filter(v => v.id !== req.params.id);
  if (writeFile(vegetablesFile, filteredVegetables)) {
    res.json({ message: 'Vegetable deleted successfully' });
  } else {
    res.status(500).json({ error: 'Failed to delete vegetable' });
  }
});

// ==================== CUSTOMERS ROUTES ====================

// Register customer
app.post('/api/customers/register', (req, res) => {
  const customers = readFile(customersFile);
  const { name, email, phone, address } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ error: 'Name, email, and phone are required' });
  }

  const existingCustomer = customers.find(c => c.email === email);
  if (existingCustomer) {
    return res.status(400).json({ error: 'Customer already exists' });
  }

  const newCustomer = {
    id: 'cust-' + uuidv4(),
    name,
    email,
    phone,
    address: address || '',
    createdAt: new Date().toISOString(),
    totalOrders: 0,
    totalSpent: 0
  };

  customers.push(newCustomer);
  if (writeFile(customersFile, customers)) {
    res.status(201).json(newCustomer);
  } else {
    res.status(500).json({ error: 'Failed to register customer' });
  }
});

// Get customer details
app.get('/api/customers/:id', (req, res) => {
  const customers = readFile(customersFile);
  const customer = customers.find(c => c.id === req.params.id);
  if (customer) {
    res.json(customer);
  } else {
    res.status(404).json({ error: 'Customer not found' });
  }
});

// Update customer
app.put('/api/customers/:id', (req, res) => {
  const customers = readFile(customersFile);
  const index = customers.findIndex(c => c.id === req.params.id);
  if (index !== -1) {
    customers[index] = { ...customers[index], ...req.body };
    if (writeFile(customersFile, customers)) {
      res.json(customers[index]);
    } else {
      res.status(500).json({ error: 'Failed to update customer' });
    }
  } else {
    res.status(404).json({ error: 'Customer not found' });
  }
});

// ==================== ORDERS ROUTES ====================

// Place order
app.post('/api/orders', (req, res) => {
  const { customerId, items, deliveryAddress, phone } = req.body;

  if (!customerId || !items || items.length === 0) {
    return res.status(400).json({ error: 'Invalid order data' });
  }

  const orders = readFile(ordersFile);
  const vegetables = readFile(vegetablesFile);
  const customers = readFile(customersFile);

  // Validate items and check stock
  let totalAmount = 0;
  for (const item of items) {
    const vegetable = vegetables.find(v => v.id === item.vegetableId);
    if (!vegetable) {
      return res.status(400).json({ error: `Vegetable ${item.vegetableId} not found` });
    }
    if (vegetable.stock < item.quantity) {
      return res.status(400).json({ error: `Insufficient stock for ${vegetable.name}` });
    }
    totalAmount += vegetable.price * item.quantity;
  }

  // Deduct from stock
  items.forEach(item => {
    const vegetable = vegetables.find(v => v.id === item.vegetableId);
    vegetable.stock -= item.quantity;
  });

  const newOrder = {
    id: 'order-' + uuidv4(),
    customerId,
    items,
    totalAmount,
    deliveryAddress,
    phone,
    status: 'Pending',
    createdAt: new Date().toISOString(),
    estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
  };

  orders.push(newOrder);

  // Update customer stats
  const customerIndex = customers.findIndex(c => c.id === customerId);
  if (customerIndex !== -1) {
    customers[customerIndex].totalOrders += 1;
    customers[customerIndex].totalSpent += totalAmount;
  }

  if (writeFile(ordersFile, orders) && writeFile(vegetablesFile, vegetables) && writeFile(customersFile, customers)) {
    res.status(201).json(newOrder);
  } else {
    res.status(500).json({ error: 'Failed to place order' });
  }
});

// Get all orders for a customer
app.get('/api/orders/customer/:customerId', (req, res) => {
  const orders = readFile(ordersFile);
  const customerOrders = orders.filter(o => o.customerId === req.params.customerId);
  res.json(customerOrders);
});

// Get order details
app.get('/api/orders/:id', (req, res) => {
  const orders = readFile(ordersFile);
  const order = orders.find(o => o.id === req.params.id);
  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ error: 'Order not found' });
  }
});

// Update order status (Admin)
app.put('/api/orders/:id/status', (req, res) => {
  const { status } = req.body;
  const orders = readFile(ordersFile);
  const index = orders.findIndex(o => o.id === req.params.id);
  if (index !== -1) {
    orders[index].status = status;
    if (writeFile(ordersFile, orders)) {
      res.json(orders[index]);
    } else {
      res.status(500).json({ error: 'Failed to update order' });
    }
  } else {
    res.status(404).json({ error: 'Order not found' });
  }
});

// Get all orders (Admin)
app.get('/api/orders', (req, res) => {
  const orders = readFile(ordersFile);
  res.json(orders);
});

// ==================== STATISTICS ====================

// Get dashboard statistics
app.get('/api/stats', (req, res) => {
  const orders = readFile(ordersFile);
  const vegetables = readFile(vegetablesFile);
  const customers = readFile(customersFile);

  const totalOrders = orders.length;
  const totalCustomers = customers.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;

  res.json({
    totalOrders,
    totalCustomers,
    totalRevenue,
    pendingOrders,
    totalProducts: vegetables.length
  });
});

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start server
const hostname = '0.0.0.0';
app.listen(PORT, hostname, () => {
  const os = require('os');
  const interfaces = os.networkInterfaces();
  let ipAddress = 'localhost';
  
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        ipAddress = iface.address;
        break;
      }
    }
  }
  
  console.log(`🌾 Vegetable Order System running on http://${ipAddress}:${PORT}`);
  console.log(`📱 Access the portal at http://${ipAddress}:${PORT}`);
  console.log(`🔗 Local: http://localhost:${PORT}`);
});
