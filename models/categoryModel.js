const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        trim: true
    },
    imageUrl: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Category', categorySchema);
