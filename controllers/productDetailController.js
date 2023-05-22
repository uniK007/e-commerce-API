const asyncHandler = require('express-async-handler');
const ProductDetail = require('../models/productDetailModel');
const Product = require('../models/productsModel');

const getProductDetails = asyncHandler(async (req, res) => {
    const productDetail = await ProductDetail.find();
    res.status(200).json(productDetail);
});
//Create product details
//with product Id, we can get only that product detail which belong to certain product
const postProductDetails = asyncHandler(async (req, res) => {
    console.log(req.body);
    try {
        const productId = await Product.findById(req.body.productId);
        if (!productId) {
            res.status(400);
            throw new Error("Catalogue product Id is required.");
        }
        const {
            color,
            producedBy,
            country,
        } = req.body;

        if (!req.body) {
            res.status(400);
            throw new Error("Some of required product Details fields doesn't exist");
        }

        const productDetails = new ProductDetail({
            color,
            producedBy,
            country,
            productId
        });
        await productDetails.save();

        res.status(201).json(productDetails);
    } catch (error) {
        res.json(error.message);
    }
});

const getProductDetailsById = asyncHandler(async (req, res) => {
    try {
        const productDetailsById = await ProductDetail.findById(req.params.id).populate('productId');

        if (!productDetailsById) {
            res.status(404);
            throw new Error("Catalogue Product doesn't exits");
        }

        res.status(200).json(productDetailsById);
    } catch (error) {
        res.json(error.message);
    }
});

const updateProductDetailsById = asyncHandler(async (req, res) => {
    try {
        const updatedProductDetails = await ProductDetail.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true
            });

        if (!updatedProductDetails) {
            res.status(404);
            throw new Error("Catalogue Product doesn't exits");
        }

        res.status(200).json({
            message: "Product data is updated successfully",
            success: true,
            updatedProductDetails
        });
    } catch (error) {
        res.json(error.message);
    }
});

const deleteProductDetailsById = asyncHandler(async (req, res) => {
    try {
        const productDetails = await ProductDetail.findByIdAndDelete(req.params.id);

        if (!productDetails) {
            res.status(404);
            throw new Error(`Product Details with id ${req.params.id}cann't be deleted, doesn't exits`);
        }

        res.status(200).json({
            message: `Product Details with id ${req.params.id} is deleted`,
            success: true
        });
    } catch (error) {
        res.json(error.message);
    }
});

// get product if productDetails subdocument have productId
const getproductDetailById = asyncHandler(async (req, res) => {
    try {
        const productId = req.params.id;

        // Find the productDetails with the given category ID
        const productDetails = await ProductDetail.find({ productId: productId });
        if (productDetails.length === 0 || !productDetails) {
            res.status(404);
            throw new Error("No matching details with this Id");
        }
        const productDetail = productDetails[0];
        res.status(200).json(productDetail);
    } catch (error) {
        res.json(error.message);
    }
});

module.exports = {
    getProductDetails,
    postProductDetails,
    getProductDetailsById,
    updateProductDetailsById,
    deleteProductDetailsById,
    getproductDetailById
};