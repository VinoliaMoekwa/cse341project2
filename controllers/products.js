const { ObjectId } = require('mongodb');
const { body, validationResult } = require('express-validator');
const mongodb = require('../data/database');

// Get all products
const getAllProducts = async (req, res) => {
    console.log('productsController.getAll called');
    const db = mongodb.getDatabase();
    const result = await db.collection('products').find();
    const products = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(products);
};

// Get a single product by id
const getSingleProduct = async (req, res) => {
    console.log(`productsController.getSingle called with id: ${req.params.id}`);
    const productId = new ObjectId(req.params.id);
    const db = mongodb.getDatabase();
    const result = await db.collection('products').findOne({ _id: productId });
    if (result) {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

// Create a new product
const createProduct = async (req, res) => {
    // Validate the incoming request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Construct the product from the request body
    const product = {
        name: req.body.name,
        category: req.body.category,
        price: req.body.price,
        stock: req.body.stock,
    };

    try {
        const db = mongodb.getDatabase();
        const response = await db.collection('products').insertOne(product);

        if (response.acknowledged) {
            res.status(201).json({ _id: response.insertedId, ...product });
        } else {
            res.status(500).json({ message: "Some error occurred while creating the product." });
        }
    } catch (err) {
        res.status(500).json({ message: "An error occurred", error: err.message });
    }
};

// Update an existing product
const updateProduct = async (req, res) => {
    // Validate the incoming request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const productId = new ObjectId(req.params.id);
    const updateProduct = {
        name: req.body.name,
        category: req.body.category,
        price: req.body.price,
        stock: req.body.stock,
    };

    try {
        const db = mongodb.getDatabase();
        const response = await db.collection('products').updateOne({ _id: productId }, { $set: updateProduct });

        if (response.modifiedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: "Product could not be updated" });
        }
    } catch (err) {
        res.status(500).json({ message: "An error occurred", error: err.message });
    }
};

// Delete a product
const deleteProduct = async (req, res) => {
    const productId = new ObjectId(req.params.id);

    try {
        const db = mongodb.getDatabase();
        const response = await db.collection('products').deleteOne({ _id: productId });

        if (response.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "An error occurred", error: err.message });
    }
};

module.exports = {
    getAllProducts,
    getSingleProduct,
    createProduct,
    updateProduct,
    deleteProduct
};
