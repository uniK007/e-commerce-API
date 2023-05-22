const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    imageUrl: {
        type: String
    },
    brandName: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true
    },
    inStock: {
        type: Number,
        default: 0,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);