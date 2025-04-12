const Product = require('../models/Product');

// Search products with query - optimized with better pagination and query performance
exports.searchProducts = async (req, res) => {
    try {
        const { query, page = 1, limit = 6 } = req.query; // Changed default limit to 6 for better grid layout
        const skip = (page - 1) * parseInt(limit);

        let searchCondition = {};

        // If query provided, create an optimized search condition
        if (query && query.trim()) {
            const sanitizedQuery = query.trim().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            
            // Use MongoDB text index for faster full-text search when possible
            if (sanitizedQuery.length > 2) {
                searchCondition = {
                    $text: { $search: sanitizedQuery }
                };
            } else {
                // For short queries, use regex but with index fields only
                searchCondition = {
                    $or: [
                        { name: { $regex: sanitizedQuery, $options: 'i' } },
                        { category: { $regex: sanitizedQuery, $options: 'i' } }
                    ]
                };
            }
        }

        // First, get a count of total matching products for pagination in a separate query
        const totalCount = await Product.countDocuments(searchCondition).exec();
        
        // Then fetch the products for this page with projection to include only needed fields
        const products = await Product.find(searchCondition, { 
            name: 1, 
            description: 1, 
            price: 1, 
            category: 1, 
            image: 1, 
            views: 1, 
            likes: 1 
        })
        .sort({ views: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean() // Use lean for better performance
        .exec();
            
        // Process for uniqueness using a Map
        const uniqueProductMap = new Map();
        products.forEach(product => {
            if (!uniqueProductMap.has(product._id.toString())) {
                uniqueProductMap.set(product._id.toString(), product);
            }
        });
        
        const uniqueProducts = Array.from(uniqueProductMap.values());
        
        // Increment view count in a separate operation
        if (uniqueProducts.length > 0) {
            const productIds = uniqueProducts.map(product => product._id);
            
            // Use a bulk operation to update view counts
            await Product.updateMany(
                { _id: { $in: productIds } },
                { $inc: { views: 1 } }
            );
        }

        // Get categories for filtering (without duplicates)
        const categories = await Product.distinct('category');

        res.json({
            products: uniqueProducts,
            totalPages: Math.ceil(totalCount / parseInt(limit)),
            currentPage: parseInt(page),
            totalProducts: totalCount,
            categories: categories // Include categories for filtering
        });
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ message: 'Server error during search', error: error.message });
    }
};

// Get all available products with pagination
exports.getAllProducts = async (req, res) => {
    try {
        const { page = 1, limit = 6, category } = req.query;
        const skip = (page - 1) * parseInt(limit);

        let query = {};
        
        // Filter by category if provided
        if (category && category !== 'all') {
            query.category = category;
        }

        // Get total count for pagination
        const totalCount = await Product.countDocuments(query);
        
        // Get products with pagination
        const products = await Product.find(query)
            .sort({ views: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .lean()
            .exec();
            
        // Get all categories for filtering
        const categories = await Product.distinct('category');

        res.json({
            products,
            totalPages: Math.ceil(totalCount / parseInt(limit)),
            currentPage: parseInt(page),
            totalProducts: totalCount,
            categories
        });
    } catch (error) {
        console.error('Get all products error:', error);
        res.status(500).json({ message: 'Server error fetching products', error: error.message });
    }
};

// Get search suggestions as user types - optimized
exports.getSearchSuggestions = async (req, res) => {
    try {
        const { query } = req.query;
        
        if (!query || query.length < 2) {
            return res.json([]);
        }

        const sanitizedQuery = query.trim().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        
        // Find products with names that match the query pattern exactly
        const products = await Product.find(
            { name: { $regex: sanitizedQuery, $options: 'i' } },
            { name: 1, _id: 0 }
        )
        .limit(5)
        .lean()
        .exec();

        // Extract unique product names for suggestions
        const uniqueSuggestions = [...new Set(products.map(item => item.name))];
        
        res.json(uniqueSuggestions);
    } catch (error) {
        console.error('Suggestion error:', error);
        res.status(500).json({ message: 'Server error getting suggestions', error: error.message });
    }
};

// Get trending products based on views or likes
exports.getTrendingProducts = async (req, res) => {
    try {
        const { metric = 'views', limit = 5 } = req.query;
        
        // Sort by the specified metric (views or likes)
        const sortCriteria = {};
        sortCriteria[metric] = -1; // -1 for descending order
        
        // Use lean for better performance
        const products = await Product.find()
            .sort(sortCriteria)
            .limit(parseInt(limit))
            .lean()
            .exec();
        
        // Ensure no duplicates in trending products
        const uniqueProductMap = new Map();
        products.forEach(product => {
            if (!uniqueProductMap.has(product._id.toString())) {
                uniqueProductMap.set(product._id.toString(), product);
            }
        });
        
        const uniqueTrendingProducts = Array.from(uniqueProductMap.values());
        
        res.json(uniqueTrendingProducts);
    } catch (error) {
        console.error('Trending products error:', error);
        res.status(500).json({ message: 'Server error getting trending products', error: error.message });
    }
};

// Add a test data generator endpoint for development
exports.seedProducts = async (req, res) => {
    try {
        // Clear existing products
        await Product.deleteMany({});

        // Sample product data
        const products = [
            {
                name: 'Smartphone X',
                description: 'Latest smartphone with amazing camera quality',
                price: 999.99,
                category: 'Electronics',
                views: Math.floor(Math.random() * 1000),
                likes: Math.floor(Math.random() * 500)
            },
            {
                name: 'Laptop Pro',
                description: 'Powerful laptop for professionals',
                price: 1499.99,
                category: 'Electronics',
                views: Math.floor(Math.random() * 1000),
                likes: Math.floor(Math.random() * 500)
            },
            {
                name: 'Wireless Headphones',
                description: 'Noise cancelling wireless headphones',
                price: 199.99,
                category: 'Audio',
                views: Math.floor(Math.random() * 1000),
                likes: Math.floor(Math.random() * 500)
            },
            {
                name: 'Smart Watch',
                description: 'Track your fitness and stay connected',
                price: 249.99,
                category: 'Wearables',
                views: Math.floor(Math.random() * 1000),
                likes: Math.floor(Math.random() * 500)
            },
            {
                name: 'Coffee Maker',
                description: 'Automatic coffee maker with built-in grinder',
                price: 129.99,
                category: 'Kitchen',
                views: Math.floor(Math.random() * 1000),
                likes: Math.floor(Math.random() * 500)
            },
            {
                name: 'Wireless Earbuds',
                description: 'True wireless earbuds with great sound quality',
                price: 89.99,
                category: 'Audio',
                views: Math.floor(Math.random() * 1000),
                likes: Math.floor(Math.random() * 500)
            },
            {
                name: 'Smart TV',
                description: '4K Ultra HD Smart TV with voice control',
                price: 799.99,
                category: 'Electronics',
                views: Math.floor(Math.random() * 1000),
                likes: Math.floor(Math.random() * 500)
            },
            {
                name: 'Wireless Mouse',
                description: 'Ergonomic wireless mouse for comfortable usage',
                price: 29.99,
                category: 'Computer Accessories',
                views: Math.floor(Math.random() * 1000),
                likes: Math.floor(Math.random() * 500)
            },
            {
                name: 'Bluetooth Speaker',
                description: 'Portable Bluetooth speaker with deep bass',
                price: 79.99,
                category: 'Audio',
                views: Math.floor(Math.random() * 1000),
                likes: Math.floor(Math.random() * 500)
            },
            {
                name: 'Digital Camera',
                description: 'Professional digital camera with 4K video',
                price: 599.99,
                category: 'Photography',
                views: Math.floor(Math.random() * 1000),
                likes: Math.floor(Math.random() * 500)
            }
        ];

        await Product.insertMany(products);

        res.json({ message: 'Sample products added successfully', count: products.length });
    } catch (error) {
        console.error('Seed error:', error);
        res.status(500).json({ message: 'Error seeding database', error: error.message });
    }
};