const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const mongoose = require('mongoose');

//GET all products
const getProduct = asyncHandler(async (req, res) => {
    const product = await Product.find();
    res.status(200).json(product);
});

//Create product 
//with category Id we can get all the products which belong to certain product
const postProduct = asyncHandler(async (req, res) => {
    console.log(req.body);
    const imageUrl = req.imageUrl;
    try {
        const category = await Category.findById(req.body.category);
        if (!category) {
            res.status(400);
            throw new Error("category product don't belong to any category.");
        }

        const { brandName, price, inStock } = req.body;
        // Access the signed URL from the request object

        if (!brandName && !price) {
            res.status(400);
            throw new Error("Product fields doesn't exist");
        }

        const product = new Product({
            imageUrl: imageUrl,
            brandName,
            price,
            inStock,
            category
        });
        await product.save();

        res.status(201).json(product);
    } catch (error) {
        res.json(error.message);
    }
});

// get products by id with category Id
// get products with category details 
const getProductById = asyncHandler(async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            res.status(400);
            throw new Error('Invalid category product Id.');
        }

        const products = await Product.findById(req.params.id).populate('category');

        if (!products) {
            res.status(404);
            throw new Error("category Product doesn't exits");
        }

        res.status(200).json(products);
    } catch (error) {
        res.json(error.message);
    }
});

//Update products by Id with category id in the request body
const updateProductById = asyncHandler(async (req, res) => {
    try {
        const category = await Category.findById(req.body.category);
        if (!category) {
            res.status(400);
            throw new Error("category product don't belong to any category.");
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true
            });

        if (!updatedProduct) {
            res.status(404);
            throw new Error("category Product doesn't exits");
        }

        res.status(200).json({
            message: "Product data is updated successfully",
            success: true,
            updatedProduct
        });
    } catch (error) {
        res.json(error.message);
    }
});

// Delete products by Id
const deleteProductById = asyncHandler(async (req, res) => {
    try {
        const products = await Product.findByIdAndDelete(req.params.id);

        if (!products) {
            res.status(404);
            throw new Error(`category Product with id ${req.params.id}cann't be deleted, doesn't exits`);
        }

        res.status(200).json({
            message: `category product with id ${req.params.id} is deleted`,
            success: true
        });
    } catch (error) {
        res.json(error.message);
    }
});

// Get all products that belong to a particular category
const getProductByCategory = asyncHandler(async (req, res) => {
    try {
        const categoryId = req.params.id;

        const products = await Product.find({ category: categoryId });
        res.status(200).json(products);
    } catch (error) {
        res.json(error.message);
    }
});

module.exports = {
    getProduct,
    getProductById,
    postProduct,
    deleteProductById,
    updateProductById,
    getProductByCategory
};