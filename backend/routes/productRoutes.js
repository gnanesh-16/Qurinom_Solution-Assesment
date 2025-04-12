const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Search products
router.get('/search', productController.searchProducts);

// Get all products with pagination
router.get('/all', productController.getAllProducts);

// Get search suggestions as user types
router.get('/suggestions', productController.getSearchSuggestions);

// Get trending products
router.get('/trending', productController.getTrendingProducts);

// Seed the database with sample products (for development)
router.post('/seed', productController.seedProducts);

module.exports = router;