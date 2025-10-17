const express = require('express');
const fs = require('fs'); // File System module
const path = require('path'); // Path module
const app = express();
const port = 3000;

const productsFilePath = path.join(__dirname, 'data', 'products.json');

// --- Middleware ---
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from 'public' folder

// --- Helper Functions ---
function getProducts() {
  const data = fs.readFileSync(productsFilePath, 'utf8');
  return JSON.parse(data);
}

function saveProducts(products) {
  fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2), 'utf8');
}

// --- Routes ---

// 1. Shop Page (for customers)
app.get('/', (req, res) => {
  const products = getProducts();
  res.render('shop', { products: products });
});

// 2. Admin Page (to view and manage products)
app.get('/admin', (req, res) => {
  const products = getProducts();
  res.render('admin', { products: products });
});

// 3. Handle Add Product Form
app.post('/admin/add', (req, res) => {
  const products = getProducts();
  const newProduct = {
    id: Date.now(), // Use timestamp as a simple unique ID
    name: req.body.name,
    price: parseFloat(req.body.price),
    image: req.body.image || 'https://via.placeholder.com/300' // Default image
  };
  
  products.push(newProduct);
  saveProducts(products);
  
  res.redirect('/admin'); // Go back to the admin page
});

// 4. Handle Delete Product Form
app.post('/admin/delete', (req, res) => {
  let products = getProducts();
  const productId = parseInt(req.body.productId, 10);
  
  // Filter out the product to be deleted
  products = products.filter(p => p.id !== productId);
  
  saveProducts(products);
  
  res.redirect('/admin'); // Go back to the admin page
});

// --- Start Server ---
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Shop:     http://localhost:${port}`);
  console.log(`Admin:    http://localhost:${port}/admin`);
});
