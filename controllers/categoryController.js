const asyncHandler = require('express-async-handler');
const Category = require('../models/categoryModel');

const getCategory = asyncHandler(async (req, res) => {
    const category = await Category.find();
    res.status(200).json(category);
});

const getCategoryById = asyncHandler(async (req, res) => {
    try {
        const productId = await Category.findById(req.params.id);
        if (!productId) {
            res.status(400);
            throw new Error("Catalogue Item doesn't exist");
        }

        res.status(200).json(productId);
    } catch (error) {
        console.log(error)
        res.json(error.message);
    }
});

const postCategory = asyncHandler(async (req, res) => {
    console.log(req.body);

    try {
        const { type } = req.body;
        const imageUrl = req.imageUrl;

        if (!type) {
            res.status(400);
            throw new Error("Enter all mandatory fields in request body");
        }

        const category = new Category({ type, imageUrl: imageUrl });
        await category.save();

        res.status(201).json(category);

    } catch (error) {
        res.status(400).json(error.message);
    }
});

const updateCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) {
        res.status(400);
        throw new Error("Catalogue Item cann't be updated because it doesn't exist");
    }

    const updateCategory = await Category.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true
        }
    );
    res.status(200).json(updateCategory);
});

const deleteCategory = asyncHandler(async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            res.status(404);
            throw new Error("Catalogue Item doesn't exist");
        }

        await Category.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Catalogue Item deleted successfully" });

    } catch (error) {
        res.json(error.message);
    }
});

module.exports = {
    getCategory,
    postCategory,
    getCategoryById,
    updateCategory,
    deleteCategory
};