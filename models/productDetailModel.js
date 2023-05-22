const mongoose = require('mongoose');

const productDetailSchema = mongoose.Schema({
    color: String,
    producedBy: String,
    country: String,
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ProductDetail', productDetailSchema);