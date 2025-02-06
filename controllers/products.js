const { ObjectId } = require('mongodb');
const mongodb = require('../data/database');

const getAllProducts = async (req, res, next) => {
    try {
        const db = mongodb.getDatabase();
        const products = await db.collection('products').find().toArray();
        res.status(200).json(products);
    } catch (err) {
        next(err);
    }
};

const getSingleProduct = async (req, res, next) => {
    try {
        const productId = new ObjectId(req.params.id);
        const db = mongodb.getDatabase();
        const product = await db.collection('products').findOne({ _id: productId });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (err) {
        next(err);
    }
};

const createProduct = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const product = {
        name: req.body.name,
        category: req.body.category,
        price: req.body.price,
        stock: req.body.stock
    };

    try {
        const db = mongodb.getDatabase();
        const response = await db.collection('products').insertOne(product);

        if (response.acknowledged) {
            res.status(201).json({ _id: response.insertedId, ...product });
        } else {
            res.status(500).json({ message: "Error creating product." });
        }
    } catch (err) {
        next(err);
    }
};

const updateProduct = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const productId = new ObjectId(req.params.id);
    const updatedProduct = {
        name: req.body.name,
        category: req.body.category,
        price: req.body.price,
        stock: req.body.stock
    };

    try {
        const db = mongodb.getDatabase();
        const response = await db.collection('products').updateOne({ _id: productId }, { $set: updatedProduct });

        if (response.modifiedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: "Product not found or no changes made." });
        }
    } catch (err) {
        next(err);
    }
};

const deleteProduct = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const productId = new ObjectId(req.params.id);
        const db = mongodb.getDatabase();
        const response = await db.collection('products').deleteOne({ _id: productId });

        if (response.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: "Product not found." });
        }
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAllProducts,
    getSingleProduct,
    createProduct,
    updateProduct,
    deleteProduct
};
