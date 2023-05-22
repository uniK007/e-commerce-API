const express = require('express');
const router = express.Router();
const uploadImage = require('../middleware/uploadImage');
const {
    getProduct,
    postProduct,
    getProductById,
    deleteProductById,
    updateProductById,
    getProductByCategory } = require('../controllers/productController');

router.route('/')
    .get(getProduct)
    .post(uploadImage, postProduct);

router.route('/:id')
    .get(getProductById)
    .delete(deleteProductById)
    .put(updateProductById);

router.route('/by-category-id/:id').get(getProductByCategory);

module.exports = router;