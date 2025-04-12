const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: true // Indexed for better search performance
    },
    description: {
        type: String,
        required: true,
        index: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true,
        index: true
    },
    image: {
        type: String,
        default: 'https://via.placeholder.com/150'
    },
    views: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create a text index for name, description, and category
productSchema.index({ name: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Product', productSchema);