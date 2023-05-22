const express = require('express');
const router = express.Router();
const { getProductDetails,
    postProductDetails,
    getProductDetailsById,
    updateProductDetailsById,
    deleteProductDetailsById,
    getCatalogueProductDetailById } = require('../controllers/productDetailController');

router.route('/')
    .get(getProductDetails)
    .post(postProductDetails);

router.route('/:id')
    .get(getProductDetailsById)
    .delete(deleteProductDetailsById)
    .put(updateProductDetailsById);

router.route('/get-product-details/:id')
    .get(getCatalogueProductDetailById);

module.exports = router; 