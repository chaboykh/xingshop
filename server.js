const express = require('express');
const app = express();
const port = 3000;

// This is our in-memory "database"
let products = [
    { id: 1, name: 'Sample Product', price: 10.00 }
];
let nextProductId = 2;

// Set up middleware
app.set('view engine', 'ejs'); // Use EJS for templates
app.use(express.urlencoded({ extended: true })); // Parse form data

// --- Routes ---

// 1. Shop Page (for customers)
app.get('/', (req, res) => {
    // Render the shop page and pass in the list of products
    res.render('shop', { products: products });
});

// 2. Admin Panel Page
app.get('/admin', (req, res) => {
    // Render the admin page and pass in the list of products
    res.render('admin', { products: products });
});

// 3. Add Product (This handles the form submission)
app.post('/add-product', (req, res) => {
    // Get data from the form
    const productName = req.body.productName;
    const productPrice = parseFloat(req.body.productPrice);

    // Create a new product object
    const newProduct = {
        id: nextProductId,
        name: productName,
        price: productPrice
    };

    // Add it to our "database"
    products.push(newProduct);
    nextProductId++;

    console.log('Product added:', newProduct);

    // Redirect the admin back to the admin page
    res.redirect('/admin');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`Shop:     http://localhost:${port}`);
    console.log(`Admin:    http://localhost:${port}/admin`);
});
