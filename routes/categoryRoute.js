const express = require('express');
const router = express.Router();
const uploadImage = require('../middleware/uploadImage');
const { getCategory, postCategory, getCategoryById, deleteCategory } = require('../controllers/categoryController');

router.route('/')
    .get(getCategory)
    .post(uploadImage, postCategory);

router.route('/:id')
    .get(getCategoryById)
    .delete(deleteCategory);

module.exports = router; 